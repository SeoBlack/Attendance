package org.example.attendancebackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class CourseDto {
    private Long id;
    @NotBlank(message = "Name is mandatory")
    private String courseName;
    @NotNull
    private String description;

    public CourseDto(Long id, String courseName, String description) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
    }
}
