package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.signup.SignupRequest;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.internal.signup.UserWithEmailExistsException;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public User signup(SignupRequest signupRequest) {
        if (signupRequest == null) throw new RuntimeException("SignUp request is null");

        if (userRepository.existsByEmail(signupRequest.getEmail()))
            throw new UserWithEmailExistsException(signupRequest.getEmail());


        User user = new User();
        user.setRole(signupRequest.getRole());
        user.setFirstName(signupRequest.getFirstName().trim());
        user.setLastName(signupRequest.getLastName().trim());
        user.setEmail(signupRequest.getEmail().trim().toLowerCase());
        if (signupRequest.getRole().equals("student"))
            user.setStudentId(signupRequest.getStudentId());
        user.setPasswordHash(passwordHasher.hash(signupRequest.getPassword()));

        userRepository.save(user);
        return user;
    }

}
