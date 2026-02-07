package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.internal.signup.SignupErrorStatus;
import org.example.attendancebackend.internal.signup.SignupResult;
import org.example.attendancebackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // TODO: Return value must be JSON
    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        try {
            SignupResult res = userService.signup(request);
            if (!res.success) {
                String msg = "Bad request";
                if(res.error == SignupErrorStatus.EMAIL_ALREADY_EXISTS) msg = "Email already exists";
                if(res.error == SignupErrorStatus.INSUFFICIENT_DATA) msg = "First name and last name are required";
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("User created");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed");
        }
    }
}
