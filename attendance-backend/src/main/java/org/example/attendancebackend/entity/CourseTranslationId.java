package org.example.attendancebackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseTranslationId implements Serializable {
    private Long courseId;
    private String locale;
}
