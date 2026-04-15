package org.example.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LectureRequest {
    private Long courseId;
    private String description;
    private Long startDate;
    private Long endDate;
}
