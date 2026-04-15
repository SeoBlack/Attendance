package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.StudentDashboardResponse;
import org.example.attendancebackend.dto.StudentHistoryResponse;
import org.example.attendancebackend.entity.Attendance;
import org.example.attendancebackend.entity.AttendanceId;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.repository.AttendanceRepository;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.EnrollmentRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.example.attendancebackend.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class StudentDashboardServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseService courseService;

    @Mock
    private LectureRepository lectureRepository;

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudentDashboardService studentDashboardService;

    private User user;
    private Course course;
    private static final Long USER_ID = 1L;
    private static final Long COURSE_ID = 10L;

    @BeforeEach
    void init() {
        user = User.builder()
                .id(USER_ID)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        course = Course.builder()
                .id(COURSE_ID)
                .courseName("Math")
                .teacherId(2L)
                .defaultLocale("en")
                .build();
    }

    // --- getDashboard tests ---

    @Test
    void getDashboard_userNotFound_throwsNotFound() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.empty());

        ResponseStatusException ex = Assertions.assertThrows(
                ResponseStatusException.class,
                () -> studentDashboardService.getDashboard(USER_ID, "en")
        );
        Assertions.assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void getDashboard_happyPath_returnsCorrectStats() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(List.of(COURSE_ID));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));

        // Past lectures: one attended, one not
        Lecture pastLecture1 = new Lecture();
        pastLecture1.setId(100L);
        pastLecture1.setCourseId(COURSE_ID);
        pastLecture1.setDescription("Lecture 1");
        pastLecture1.setStartDate(Timestamp.valueOf(LocalDateTime.now().minusDays(2)));
        pastLecture1.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(2).plusHours(1)));

        Lecture pastLecture2 = new Lecture();
        pastLecture2.setId(101L);
        pastLecture2.setCourseId(COURSE_ID);
        pastLecture2.setDescription("Lecture 2");
        pastLecture2.setStartDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1)));
        pastLecture2.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1).plusHours(1)));

        // Today's lecture
        Lecture todayLecture = new Lecture();
        todayLecture.setId(102L);
        todayLecture.setCourseId(COURSE_ID);
        todayLecture.setDescription("Today Lecture");
        todayLecture.setStartDate(Timestamp.valueOf(LocalDate.now().atTime(10, 0)));
        todayLecture.setEndDate(Timestamp.valueOf(LocalDate.now().atTime(11, 0)));

        // Future lecture (should be excluded from stats)
        Lecture futureLecture = new Lecture();
        futureLecture.setId(103L);
        futureLecture.setCourseId(COURSE_ID);
        futureLecture.setDescription("Future Lecture");
        futureLecture.setStartDate(Timestamp.valueOf(LocalDateTime.now().plusDays(5)));
        futureLecture.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(5).plusHours(1)));

        given(lectureRepository.findByCourseId(COURSE_ID))
                .willReturn(List.of(pastLecture1, pastLecture2, todayLecture, futureLecture));

        // User attended pastLecture1 and todayLecture
        Timestamp scannedAt1 = Timestamp.valueOf(LocalDateTime.now().minusDays(2).plusMinutes(5));
        Timestamp scannedAtToday = Timestamp.valueOf(LocalDate.now().atTime(10, 5));
        Attendance att1 = Attendance.builder()
                .attendanceId(new AttendanceId(USER_ID, 100L))
                .scannedAt(scannedAt1)
                .build();
        Attendance attToday = Attendance.builder()
                .attendanceId(new AttendanceId(USER_ID, 102L))
                .scannedAt(scannedAtToday)
                .build();

        given(attendanceRepository.findByAttendanceIdUserId(USER_ID))
                .willReturn(List.of(att1, attToday));

        StudentDashboardResponse response = studentDashboardService.getDashboard(USER_ID, "en");

        Assertions.assertEquals("John", response.firstName());
        Assertions.assertEquals("Doe", response.lastName());
        // Started lectures: pastLecture1, pastLecture2, todayLecture = 3
        Assertions.assertEquals(3, response.totalLectures());
        // Attended: pastLecture1 + todayLecture = 2
        Assertions.assertEquals(2, response.presentCount());
        Assertions.assertEquals(1, response.absentCount());
        // Rate: 2/3 * 100 = 66.7
        Assertions.assertEquals(66.7, response.attendanceRate());

        // Today's lectures should contain exactly the today lecture
        Assertions.assertEquals(1, response.todayLectures().size());
        Assertions.assertEquals(102L, response.todayLectures().get(0).lectureId());
        Assertions.assertTrue(response.todayLectures().get(0).attended());

        // Recent activity: 3 started lectures, most recent first
        Assertions.assertEquals(3, response.recentActivity().size());
        Assertions.assertEquals(102L, response.recentActivity().get(0).lectureId());
        Assertions.assertTrue(response.recentActivity().get(0).present());
        Assertions.assertEquals(101L, response.recentActivity().get(1).lectureId());
        Assertions.assertFalse(response.recentActivity().get(1).present());
    }

    @Test
    void getDashboard_noEnrollments_returnsEmptyStats() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(Collections.emptyList());
        given(attendanceRepository.findByAttendanceIdUserId(USER_ID)).willReturn(Collections.emptyList());

        StudentDashboardResponse response = studentDashboardService.getDashboard(USER_ID, "en");

        Assertions.assertEquals("John", response.firstName());
        Assertions.assertEquals(0, response.totalLectures());
        Assertions.assertEquals(0, response.presentCount());
        Assertions.assertEquals(0, response.absentCount());
        Assertions.assertEquals(0.0, response.attendanceRate());
        Assertions.assertTrue(response.todayLectures().isEmpty());
        Assertions.assertTrue(response.recentActivity().isEmpty());
    }

    @Test
    void getDashboard_onlyFutureLectures_zeroStats() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(List.of(COURSE_ID));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));

        Lecture futureLecture = new Lecture();
        futureLecture.setId(200L);
        futureLecture.setCourseId(COURSE_ID);
        futureLecture.setStartDate(Timestamp.valueOf(LocalDateTime.now().plusDays(10)));
        futureLecture.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(10).plusHours(1)));

        given(lectureRepository.findByCourseId(COURSE_ID)).willReturn(List.of(futureLecture));
        given(attendanceRepository.findByAttendanceIdUserId(USER_ID)).willReturn(Collections.emptyList());

        StudentDashboardResponse response = studentDashboardService.getDashboard(USER_ID, "en");

        Assertions.assertEquals(0, response.totalLectures());
        Assertions.assertEquals(0, response.presentCount());
        Assertions.assertEquals(0, response.absentCount());
        Assertions.assertEquals(0.0, response.attendanceRate());
    }

    @Test
    void getDashboard_userPreferredLocale_usedOverRequestLocale() {
        user.setPreferredLocale("ru");
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(List.of(COURSE_ID));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));
        given(lectureRepository.findByCourseId(COURSE_ID)).willReturn(Collections.emptyList());
        given(attendanceRepository.findByAttendanceIdUserId(USER_ID)).willReturn(Collections.emptyList());

        studentDashboardService.getDashboard(USER_ID, "en");

        // Verify applyTranslation was called with user's preferred locale "ru", not request "en"
        verify(courseService).applyTranslation(any(Course.class), eq("ru"));
    }

    // --- getHistory tests ---

    @Test
    void getHistory_userNotFound_throwsNotFound() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.empty());

        ResponseStatusException ex = Assertions.assertThrows(
                ResponseStatusException.class,
                () -> studentDashboardService.getHistory(USER_ID, "en")
        );
        Assertions.assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void getHistory_happyPath_returnsRecordsSortedDesc() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(List.of(COURSE_ID));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));

        Lecture lecture1 = new Lecture();
        lecture1.setId(100L);
        lecture1.setCourseId(COURSE_ID);
        lecture1.setDescription("Lecture 1");
        lecture1.setStartDate(Timestamp.valueOf(LocalDateTime.now().minusDays(3)));
        lecture1.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(3).plusHours(1)));

        Lecture lecture2 = new Lecture();
        lecture2.setId(101L);
        lecture2.setCourseId(COURSE_ID);
        lecture2.setDescription("Lecture 2");
        lecture2.setStartDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1)));
        lecture2.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1).plusHours(1)));

        given(lectureRepository.findByCourseId(COURSE_ID)).willReturn(List.of(lecture1, lecture2));

        Timestamp scannedAt = Timestamp.valueOf(LocalDateTime.now().minusDays(1).plusMinutes(5));
        Attendance att = Attendance.builder()
                .attendanceId(new AttendanceId(USER_ID, 101L))
                .scannedAt(scannedAt)
                .build();
        given(attendanceRepository.findByAttendanceIdUserId(USER_ID)).willReturn(List.of(att));

        StudentHistoryResponse response = studentDashboardService.getHistory(USER_ID, "en");

        Assertions.assertEquals(2, response.records().size());
        // Most recent first
        Assertions.assertEquals(101L, response.records().get(0).lectureId());
        Assertions.assertTrue(response.records().get(0).present());
        Assertions.assertEquals(scannedAt, response.records().get(0).scannedAt());

        Assertions.assertEquals(100L, response.records().get(1).lectureId());
        Assertions.assertFalse(response.records().get(1).present());
        Assertions.assertNull(response.records().get(1).scannedAt());
    }

    @Test
    void getHistory_noLectures_returnsEmptyRecords() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(List.of(COURSE_ID));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));
        given(lectureRepository.findByCourseId(COURSE_ID)).willReturn(Collections.emptyList());
        given(attendanceRepository.findByAttendanceIdUserId(USER_ID)).willReturn(Collections.emptyList());

        StudentHistoryResponse response = studentDashboardService.getHistory(USER_ID, "en");

        Assertions.assertTrue(response.records().isEmpty());
    }

    @Test
    void getHistory_futureLecturesExcluded() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(enrollmentRepository.findCourseIdsByUserId(USER_ID)).willReturn(List.of(COURSE_ID));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));

        Lecture pastLecture = new Lecture();
        pastLecture.setId(100L);
        pastLecture.setCourseId(COURSE_ID);
        pastLecture.setDescription("Past");
        pastLecture.setStartDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1)));
        pastLecture.setEndDate(Timestamp.valueOf(LocalDateTime.now().minusDays(1).plusHours(1)));

        Lecture futureLecture = new Lecture();
        futureLecture.setId(200L);
        futureLecture.setCourseId(COURSE_ID);
        futureLecture.setDescription("Future");
        futureLecture.setStartDate(Timestamp.valueOf(LocalDateTime.now().plusDays(5)));
        futureLecture.setEndDate(Timestamp.valueOf(LocalDateTime.now().plusDays(5).plusHours(1)));

        given(lectureRepository.findByCourseId(COURSE_ID)).willReturn(List.of(pastLecture, futureLecture));
        given(attendanceRepository.findByAttendanceIdUserId(USER_ID)).willReturn(Collections.emptyList());

        StudentHistoryResponse response = studentDashboardService.getHistory(USER_ID, "en");

        Assertions.assertEquals(1, response.records().size());
        Assertions.assertEquals(100L, response.records().get(0).lectureId());
    }
}
