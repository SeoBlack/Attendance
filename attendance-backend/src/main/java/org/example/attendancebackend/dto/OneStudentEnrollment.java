package org.example.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OneStudentEnrollment {
    private String firstName;
    private String lastName;
    private String email;
}
