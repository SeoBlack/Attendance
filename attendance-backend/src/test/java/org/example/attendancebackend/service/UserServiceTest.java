package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
@Import({UserService.class, PasswordHasher.class})
class UserServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordHasher passwordHasher;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void signup_newEmail_createsUserWithPasswordHash() {
        SignupRequest request = new SignupRequest(
                "John", "Doe", UserRole.STUDENT, "New@Example.com", "secret");

        userService.signup(request);

        assertEquals(1, userRepository.count());
        User user = userRepository.findByEmailIgnoreCase("new@example.com").orElseThrow();
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals(UserRole.STUDENT, user.getRole());
        assertTrue(passwordHasher.matches("secret", user.getPasswordHash()));
    }

    @Test
    void signup_existingPlaceholder_setsPasswordOnly() {
        User placeholder = new User();
        placeholder.setRole(UserRole.STUDENT);
        placeholder.setFirstName("From");
        placeholder.setLastName("Teacher");
        placeholder.setEmail("mixed@Example.com");
        userRepository.save(placeholder);

        SignupRequest request = new SignupRequest(
                "Signup", "Names", UserRole.STUDENT, "mixed@example.com", "pw");

        userService.signup(request);

        assertEquals(1, userRepository.count());
        User saved = userRepository.findByEmailIgnoreCase("mixed@example.com").orElseThrow();
        assertEquals("From", saved.getFirstName());
        assertEquals("Teacher", saved.getLastName());
        assertTrue(passwordHasher.matches("pw", saved.getPasswordHash()));
    }

    @Test
    void signup_existingWithPassword_rejects() {
        User existing = new User();
        existing.setRole(UserRole.STUDENT);
        existing.setFirstName("A");
        existing.setLastName("B");
        existing.setEmail("taken@example.com");
        existing.setPasswordHash(passwordHasher.hash("old"));
        userRepository.save(existing);

        SignupRequest request = new SignupRequest(
                "A", "B", UserRole.STUDENT, "taken@example.com", "pw");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.signup(request));
        assertEquals("User already exists", ex.getMessage());
        assertEquals(1, userRepository.count());
    }
}
