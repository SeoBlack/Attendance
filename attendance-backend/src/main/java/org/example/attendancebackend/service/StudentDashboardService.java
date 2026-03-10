package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.StudentDashboardResponse;
import org.example.attendancebackend.dto.StudentDashboardResponse.AttendanceRecord;
import org.example.attendancebackend.dto.StudentDashboardResponse.TodayLecture;
import org.example.attendancebackend.dto.StudentHistoryResponse;
import org.example.attendancebackend.dto.StudentHistoryResponse.HistoryRecord;
import org.example.attendancebackend.entity.Attendance;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.repository.AttendanceRepository;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.EnrollmentRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.example.attendancebackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentDashboardService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final LectureRepository lectureRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public StudentDashboardService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            LectureRepository lectureRepository,
            AttendanceRepository attendanceRepository,
            UserRepository userRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.lectureRepository = lectureRepository;
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    public StudentDashboardResponse getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Long> courseIds = enrollmentRepository.findCourseIdsByUserId(userId);

        Map<Long, Course> courseMap = new HashMap<>();
        for (Long courseId : courseIds) {
            courseRepository.findById(courseId).ifPresent(c -> courseMap.put(c.getId(), c));
        }

        List<Lecture> allLectures = new ArrayList<>();
        for (Long courseId : courseIds) {
            allLectures.addAll(lectureRepository.findByCourseId(courseId));
        }

        Set<Long> attendedLectureIds = attendanceRepository.findByAttendanceIdUserId(userId)
                .stream()
                .map(a -> a.getAttendanceId().getLectureId())
                .collect(Collectors.toSet());

        Map<Long, Timestamp> attendanceTimeMap = attendanceRepository.findByAttendanceIdUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        a -> a.getAttendanceId().getLectureId(),
                        Attendance::getScannedAt
                ));

        // Count lectures that have already started for stats
        Timestamp now = Timestamp.valueOf(LocalDateTime.now());
        List<Lecture> startedLectures = allLectures.stream()
                .filter(l -> l.getStartDate() != null && !l.getStartDate().after(now))
                .toList();

        int totalLectures = startedLectures.size();
        int presentCount = (int) startedLectures.stream()
                .filter(l -> attendedLectureIds.contains(l.getId()))
                .count();
        int absentCount = totalLectures - presentCount;
        double attendanceRate = totalLectures > 0 ? (presentCount * 100.0) / totalLectures : 0;

        // Today's lectures
        LocalDate today = LocalDate.now();
        Timestamp startOfDay = Timestamp.valueOf(today.atStartOfDay());
        Timestamp endOfDay = Timestamp.valueOf(today.atTime(LocalTime.MAX));

        List<TodayLecture> todayLectures = allLectures.stream()
                .filter(l -> l.getStartDate() != null
                        && !l.getStartDate().before(startOfDay)
                        && !l.getStartDate().after(endOfDay))
                .sorted(Comparator.comparing(Lecture::getStartDate))
                .map(l -> new TodayLecture(
                        l.getId(),
                        courseMap.getOrDefault(l.getCourseId(), Course.builder().courseName("Unknown").build()).getCourseName(),
                        l.getDescription(),
                        l.getStartDate(),
                        l.getEndDate(),
                        attendedLectureIds.contains(l.getId())
                ))
                .toList();

        // Recent activity: last 10 started lectures sorted by date desc
        List<AttendanceRecord> recentActivity = startedLectures.stream()
                .sorted(Comparator.comparing(Lecture::getStartDate).reversed())
                .limit(10)
                .map(l -> {
                    boolean present = attendedLectureIds.contains(l.getId());
                    Timestamp time = present ? attendanceTimeMap.get(l.getId()) : l.getStartDate();
                    return new AttendanceRecord(
                            l.getId(),
                            courseMap.getOrDefault(l.getCourseId(), Course.builder().courseName("Unknown").build()).getCourseName(),
                            time,
                            present
                    );
                })
                .toList();

        return new StudentDashboardResponse(
                user.getFirstName(),
                user.getLastName(),
                totalLectures,
                presentCount,
                absentCount,
                Math.round(attendanceRate * 10.0) / 10.0,
                todayLectures,
                recentActivity
        );
    }

    public StudentHistoryResponse getHistory(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Long> courseIds = enrollmentRepository.findCourseIdsByUserId(userId);

        Map<Long, Course> courseMap = new HashMap<>();
        for (Long courseId : courseIds) {
            courseRepository.findById(courseId).ifPresent(c -> courseMap.put(c.getId(), c));
        }

        List<Lecture> allLectures = new ArrayList<>();
        for (Long courseId : courseIds) {
            allLectures.addAll(lectureRepository.findByCourseId(courseId));
        }

        Map<Long, Timestamp> attendanceTimeMap = attendanceRepository.findByAttendanceIdUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        a -> a.getAttendanceId().getLectureId(),
                        Attendance::getScannedAt
                ));

        Timestamp now = Timestamp.valueOf(LocalDateTime.now());
        List<HistoryRecord> records = allLectures.stream()
                .filter(l -> l.getStartDate() != null && !l.getStartDate().after(now))
                .sorted(Comparator.comparing(Lecture::getStartDate).reversed())
                .map(l -> {
                    boolean present = attendanceTimeMap.containsKey(l.getId());
                    return new HistoryRecord(
                            l.getId(),
                            courseMap.getOrDefault(l.getCourseId(), Course.builder().courseName("Unknown").build()).getCourseName(),
                            l.getDescription(),
                            l.getStartDate(),
                            l.getEndDate(),
                            present,
                            present ? attendanceTimeMap.get(l.getId()) : null
                    );
                })
                .toList();

        return new StudentHistoryResponse(records);
    }
}
