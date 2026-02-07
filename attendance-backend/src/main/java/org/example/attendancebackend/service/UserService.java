package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.internal.signup.SignupErrorStatus;
import org.example.attendancebackend.internal.signup.SignupResult;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.example.attendancebackend.util.StringValidator;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public SignupResult signup(SignupRequest request) {
        if (request == null) throw new RuntimeException("SignUp request is null");

        if (
                StringValidator.isBlank(request.getFirstName()) ||
                        StringValidator.isBlank(request.getLastName()) ||
                        StringValidator.isBlank(request.getEmail()) ||
                        StringValidator.isBlank(request.getPassword())
//                        || StringValidator.isBlank(request.getRole())
        ) {
            return SignupResult.failure(SignupErrorStatus.INSUFFICIENT_DATA);
        }
//        if(request.getRole() == "student")

        if (userRepository.existsByEmail(request.getEmail())) {
            return SignupResult.failure(SignupErrorStatus.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordHasher.hash(request.getPassword()));

        userRepository.save(user);
        return SignupResult.ok();
    }

}
