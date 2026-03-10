package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Attendance;
import org.example.attendancebackend.entity.AttendanceId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, AttendanceId> {
    List<Attendance> findByAttendanceIdLectureId(Long lectureId);

    List<Attendance> findByAttendanceIdUserId(Long userId);
}