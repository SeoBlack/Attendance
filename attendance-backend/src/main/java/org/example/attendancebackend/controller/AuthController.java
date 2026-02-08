package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.SigninRequest;
import org.example.attendancebackend.dto.signup.SignupRequest;
import org.example.attendancebackend.dto.signup.SignupResponse;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.internal.signup.UserWithEmailExistsException;
import org.example.attendancebackend.service.UserService;
import org.example.attendancebackend.util.StringValidator;
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

    @ExceptionHandler(UserWithEmailExistsException.class)
    public ResponseEntity<SignupResponse> handleTechnicalException(UserWithEmailExistsException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new SignupResponse(false, "User with such email already exists"));

    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity handleTechnicalException(RuntimeException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SignupResponse(false, "Unexpected error occurred. Please try again later"));

    }

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest signupRequest) {
        if (StringValidator.isBlank(signupRequest.getFirstName())
                || StringValidator.isBlank(signupRequest.getLastName())
                || StringValidator.isBlank(signupRequest.getEmail())
                || StringValidator.isBlank(signupRequest.getPassword())
                || StringValidator.isBlank(signupRequest.getRole().getValue())
                || (signupRequest.getRole() == UserRole.STUDENT && StringValidator.isBlank(signupRequest.getStudentId()))
        ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new SignupResponse(false, "Mandatory fields are not provided"));

        userService.signup(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SignupResponse(true, ""));

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
