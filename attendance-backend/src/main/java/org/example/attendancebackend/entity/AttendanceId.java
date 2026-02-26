package org.example.attendancebackend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceId {
    private Long userId;
    private Long lectureId;
    public Long getUserId() {
        return userId;
    }
    public Long getLectureId() {
        return lectureId;
    }
}
