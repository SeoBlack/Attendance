package org.example.attendancebackend.dto;

import java.sql.Timestamp;
import java.util.List;

public record StudentDashboardResponse(
        String firstName,
        String lastName,
        int totalLectures,
        int presentCount,
        int absentCount,
        double attendanceRate,
        List<TodayLecture> todayLectures,
        List<AttendanceRecord> recentActivity
) {
    public record TodayLecture(
            Long lectureId,
            String courseName,
            String description,
            Timestamp startDate,
            Timestamp endDate,
            boolean attended
    ) {}

    public record AttendanceRecord(
            Long lectureId,
            String courseName,
            Timestamp scannedAt,
            boolean present
    ) {}
}
