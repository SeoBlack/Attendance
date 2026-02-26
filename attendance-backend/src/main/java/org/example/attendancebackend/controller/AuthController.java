package org.example.attendancebackend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.attendancebackend.dto.SigninRequest;
import org.example.attendancebackend.dto.SigninResponse;
import org.example.attendancebackend.dto.SignupRequest;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.service.JwtService;
import org.example.attendancebackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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

    @PostMapping("/signout")
    public ResponseEntity<Void> signout(HttpServletRequest request, HttpServletResponse response) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
        } catch (Exception ignored) {

        }

        Cookie cookie = new Cookie("JSESSIONID", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
}
