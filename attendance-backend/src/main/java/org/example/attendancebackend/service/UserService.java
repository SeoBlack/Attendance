package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.entity.User;
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

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordHasher.hash(request.getPassword()));

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
