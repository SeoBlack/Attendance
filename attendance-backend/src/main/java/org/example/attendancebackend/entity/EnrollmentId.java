package org.example.attendancebackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentId implements Serializable {
    @Column(name = "user_id")  private Long userId;
    @Column(name = "course_id") private Long courseId;
}
