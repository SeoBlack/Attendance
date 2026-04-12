package org.example.attendancebackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_translation")
@IdClass(CourseTranslationId.class)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CourseTranslation {

    @Id
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Id
    @Column(name = "locale", nullable = false, length = 10)
    private String locale;

    @Column(name = "course_name", nullable = false, length = 200)
    private String courseName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
