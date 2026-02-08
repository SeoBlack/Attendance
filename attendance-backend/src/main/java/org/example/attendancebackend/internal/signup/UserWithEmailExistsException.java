package org.example.attendancebackend.internal.signup;

public class UserWithEmailExistsException extends RuntimeException {
    public UserWithEmailExistsException(String email) {
        super("User with email " + email + " already exists");
    }
}
