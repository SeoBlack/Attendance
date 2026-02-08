package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.signup.SignupRequest;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.internal.signup.UserWithEmailExistsException;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.example.attendancebackend.dto.SigninRequest;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public void signup(SignupRequest signupRequest) {
        if (signupRequest == null) throw new RuntimeException("SignUp request is null");

        String normalizedEmail = signupRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail))
            throw new UserWithEmailExistsException(normalizedEmail);


        User user = new User();
        user.setRole(signupRequest.getRole());
        user.setFirstName(signupRequest.getFirstName().trim());
        user.setLastName(signupRequest.getLastName().trim());
        user.setEmail(normalizedEmail);
        if (signupRequest.getRole() == UserRole.STUDENT)
            user.setStudentId(signupRequest.getStudentId());
        user.setPasswordHash(passwordHasher.hash(signupRequest.getPassword()));

        userRepository.save(user);
    }

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

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
