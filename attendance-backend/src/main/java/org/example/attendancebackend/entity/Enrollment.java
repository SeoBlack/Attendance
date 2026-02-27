package org.example.attendancebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(name="enrollments")
public class Enrollment {
    @EmbeddedId
    private EnrollmentId id;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false) // same column as EnrollmentId.userId
    private User user;

    public Enrollment(EnrollmentId id) {
        this.id = id;
    }
}
