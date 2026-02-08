package org.example.attendancebackend.dto.signup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SignupResponse {
    private boolean success;
    private String error;
}
