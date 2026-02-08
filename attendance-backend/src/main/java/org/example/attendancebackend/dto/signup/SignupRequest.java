package org.example.attendancebackend.dto.signup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.attendancebackend.entity.UserRole;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SignupRequest {
    private String firstName;
    private String lastName;
    private UserRole role;
    private String email;
    private String password;
    private String studentId;
}
