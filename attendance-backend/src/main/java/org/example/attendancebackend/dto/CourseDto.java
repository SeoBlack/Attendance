package org.example.attendancebackend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseDto {
    private Long id;
    private String courseName;
    private String description;

    public CourseDto(Long id, String courseName, String description) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
    }
}
