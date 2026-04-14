package org.example.attendancebackend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.attendancebackend.dto.SigninRequest;
import org.example.attendancebackend.dto.SigninResponse;
import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.dto.MeResponse;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.service.JwtService;
import org.example.attendancebackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import lombok.extern.slf4j.Slf4j;


@RestController
@Slf4j
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, JwtService jwtService, UserRepository userRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        try {
            userService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created");
        } catch (Exception e) {
            log.error("Signup failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed");
        }
    }

    @PostMapping(
            value = "/signin",
            consumes = "application/json",
            produces = "application/json"
    )
    public ResponseEntity<?> signin(@RequestBody SigninRequest request) {
        try {
            User user = userService.authenticate(request);
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new SigninResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Object userIdAttr = request.getAttribute("authUserId");
        Object emailAttr = request.getAttribute("authEmail");

        if (userIdAttr == null || emailAttr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        Long userId = (Long) userIdAttr;
        String email = String.valueOf(emailAttr);

        User user = userRepository.findById(userId)
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(new MeResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().getValue()
        ));
    }
}
