package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.signup.SignupRequest;
import org.example.attendancebackend.dto.signup.SignupResponse;
import org.example.attendancebackend.internal.signup.SignupError;
import org.example.attendancebackend.internal.signup.SignupResult;
import org.example.attendancebackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest signupRequest) {
        try {
            SignupResult res = userService.signup(signupRequest);
            if (!res.success) {
                String msg = "Unknown error";
                if(res.errorStatus == SignupError.EMAIL_ALREADY_EXISTS) msg = "Email already exists";
                if(res.errorStatus == SignupError.INSUFFICIENT_DATA) msg = "Mandatory fields are not provided";
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new SignupResponse(false, msg));
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(new SignupResponse(true, ""));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new SignupResponse(false, "Unexpected error"));
        }
    }
}
