package org.example.attendancebackend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AttendanceId implements Serializable {
    private Long userId;
    private Long lectureId;
    public Long getUserId() {
        return userId;
    }
    public Long getLectureId() {
        return lectureId;
    }
}
