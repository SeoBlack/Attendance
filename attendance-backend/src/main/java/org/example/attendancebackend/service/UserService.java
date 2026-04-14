package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.example.attendancebackend.dto.SigninRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    /**
     * Constructs UserService with user repository and password hasher.
     * @param userRepository repository for User entities
     * @param passwordHasher utility for hashing and verifying passwords
     */
    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    /**
     * Creates a new user or completes registration if a user with email exists without password.
     * Validates mandatory fields and hashes password.
     * @param request signup data
     * @throws RuntimeException if validation fails or user already exists with password
     */
    public void signup(SignupRequest request) {
        if (request == null) {
            throw new RuntimeException("Request is null");
        }

        if (isBlank(request.getFirstName()) || isBlank(request.getLastName())) {
            throw new RuntimeException("First name and last name are required");
        }

        if (isBlank(request.getEmail()) || isBlank(request.getPassword()) || request.getRole() == null || isBlank(request.getRole().getValue())) {
            throw new RuntimeException("Email, password and role are required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Optional<User> optionalExisting = userRepository.findByEmailIgnoreCase(normalizedEmail);
        if (optionalExisting.isPresent()) {
            User existing = optionalExisting.get();
            if (hasPassword(existing)) {
                throw new RuntimeException("User already exists");
            }
            existing.setPasswordHash(passwordHasher.hash(request.getPassword()));
            userRepository.save(existing);
            return;
        }

        User user = new User();
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordHasher.hash(request.getPassword()));

        userRepository.save(user);
    }

    private static boolean hasPassword(User user) {
        String hash = user.getPasswordHash();
        return hash != null && !hash.isBlank();
    }

    /**
     * Verifies user credentials. Throws on failure.
     * @param request signin data
     * @throws RuntimeException on invalid input or invalid credentials
     */
    public void signin(SigninRequest request) {
        if (request == null) {
            throw new RuntimeException("Request is null");
        }

        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new RuntimeException("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordHasher.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    /**
     * Authenticates user and returns the User entity on success.
     * @param request signin data
     * @return authenticated User
     * @throws RuntimeException on invalid input or invalid credentials
     */
    public User authenticate(SigninRequest request) {
        if (request == null) {
            throw new RuntimeException("Request is null");
        }

        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new RuntimeException("Email and password are required");
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordHasher.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
