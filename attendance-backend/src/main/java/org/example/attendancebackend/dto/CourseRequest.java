package org.example.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CourseRequest {
    private Long id;
    private String courseName;
    private String description;
    private String defaultLocale;
    private String instructionLanguage;
}
