package org.example.attendancebackend.dto;

import java.sql.Timestamp;
import java.util.List;

public record StudentHistoryResponse(
        List<HistoryRecord> records
) {
    public record HistoryRecord(
            Long lectureId,
            String courseName,
            String lectureDescription,
            Timestamp lectureStartDate,
            Timestamp lectureEndDate,
            boolean present,
            Timestamp scannedAt
    ) {}
}
