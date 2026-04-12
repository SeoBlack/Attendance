package org.example.attendancebackend.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long id;

    /**
     * Resolved text for the requested locale (API response / request body). Not a column.
     * Validated in {@link org.example.attendancebackend.service.CourseService#saveCourse(Course)} — not Bean Validation here,
     * because Hibernate validates persisted state and transients are omitted from the row insert.
     */
    @Transient
    private String courseName;

    @Transient
    private String description;

    @Column(name = "teacher_id")
    private Long teacherId;

    /**
     * Locale of the {@link #courseName} / {@link #description} submitted on create/update (BCP-47 primary, e.g. en, ar, ru).
     */
    @Column(name = "default_locale", nullable = false, length = 10)
    @Builder.Default
    private String defaultLocale = "en";

    /**
     * Primary language of instruction; used for filtering. Optional.
     */
    @Column(name = "instruction_language", length = 10)
    private String instructionLanguage;
}
