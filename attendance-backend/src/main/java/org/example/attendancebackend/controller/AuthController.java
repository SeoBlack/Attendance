package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.dto.SigninRequest;
import org.example.attendancebackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        try {
            userService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed");
        }
    }

    @PostMapping(value = "/signin", consumes = "application/json")
    public ResponseEntity<String> signin(@RequestBody SigninRequest request) {
        try {
            userService.signin(request);
            return ResponseEntity.ok("Login successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid credentials");
        }
    }

}
