package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.signup.SignupRequest;
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

    public SignupResult signup(SignupRequest signupRequest) {
        if (signupRequest == null) throw new RuntimeException("SignUp request is null");

        if (
                StringValidator.isBlank(signupRequest.getFirstName()) ||
                        StringValidator.isBlank(signupRequest.getLastName()) ||
                        StringValidator.isBlank(signupRequest.getEmail()) ||
                        StringValidator.isBlank(signupRequest.getPassword())
//                        || StringValidator.isBlank(request.getRole())
        ) {
            return SignupResult.failure(SignupErrorStatus.INSUFFICIENT_DATA);
        }
//        if(request.getRole() == "student")

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return SignupResult.failure(SignupErrorStatus.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setRole(signupRequest.getRole());
        user.setFirstName(signupRequest.getFirstName().trim());
        user.setLastName(signupRequest.getLastName().trim());
        user.setEmail(signupRequest.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordHasher.hash(signupRequest.getPassword()));

        userRepository.save(user);
        return SignupResult.ok();
    }

}
