package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.entity.*;
import org.example.attendancebackend.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.rmi.AlreadyBoundException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LectureRepository lectureRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private User user;
    private Lecture lecture;
    private Course course;

    private static final Long USER_ID = 1L;
    private static final Long LECTURE_ID = 10L;
    private static final Long COURSE_ID = 20L;
    private static final String JOIN_CODE = "ABC123";

    @BeforeEach
    void init() {
        user = User.builder()
                .id(USER_ID)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .role(UserRole.STUDENT)
                .build();

        lecture = new Lecture();
        lecture.setId(LECTURE_ID);
        lecture.setCourseId(COURSE_ID);
        lecture.setJoinCode(JOIN_CODE);

        course = Course.builder()
                .id(COURSE_ID)
                .courseName("Math")
                .teacherId(2L)
                .build();
    }

    // --- MarkAttendance tests ---

    @Test
    void markAttendance_userNotFound_throws() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.empty());

        Assertions.assertThrows(NoSuchElementException.class,
                () -> attendanceService.MarkAttendance(USER_ID, JOIN_CODE));
    }

    @Test
    void markAttendance_lectureNotFound_throws() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(lectureRepository.findByJoinCode(JOIN_CODE)).willReturn(Optional.empty());

        Assertions.assertThrows(NoSuchElementException.class,
                () -> attendanceService.MarkAttendance(USER_ID, JOIN_CODE));
    }

    @Test
    void markAttendance_courseNotFound_throws() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(lectureRepository.findByJoinCode(JOIN_CODE)).willReturn(Optional.of(lecture));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.empty());

        Assertions.assertThrows(NoSuchElementException.class,
                () -> attendanceService.MarkAttendance(USER_ID, JOIN_CODE));
    }

    @Test
    void markAttendance_notEnrolled_throwsIllegalAccess() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(lectureRepository.findByJoinCode(JOIN_CODE)).willReturn(Optional.of(lecture));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));
        given(enrollmentRepository.findUsersByCourseId(COURSE_ID)).willReturn(Collections.emptyList());

        Assertions.assertThrows(IllegalAccessException.class,
                () -> attendanceService.MarkAttendance(USER_ID, JOIN_CODE));
    }

    @Test
    void markAttendance_alreadyMarked_throwsAlreadyBound() {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(lectureRepository.findByJoinCode(JOIN_CODE)).willReturn(Optional.of(lecture));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));
        EnrolledUser enrolled = new EnrolledUser(USER_ID, "John", "Doe", "john@example.com");
        given(enrollmentRepository.findUsersByCourseId(COURSE_ID)).willReturn(List.of(enrolled));
        given(attendanceRepository.findById(new AttendanceId(USER_ID, LECTURE_ID)))
                .willReturn(Optional.of(Attendance.builder()
                        .attendanceId(new AttendanceId(USER_ID, LECTURE_ID))
                        .scannedAt(new Timestamp(System.currentTimeMillis()))
                        .build()));

        Assertions.assertThrows(AlreadyBoundException.class,
                () -> attendanceService.MarkAttendance(USER_ID, JOIN_CODE));
    }

    @Test
    void markAttendance_happyPath_savesAndReturns() throws Exception {
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));
        given(lectureRepository.findByJoinCode(JOIN_CODE)).willReturn(Optional.of(lecture));
        given(courseRepository.findById(COURSE_ID)).willReturn(Optional.of(course));
        EnrolledUser enrolled = new EnrolledUser(USER_ID, "John", "Doe", "john@example.com");
        given(enrollmentRepository.findUsersByCourseId(COURSE_ID)).willReturn(List.of(enrolled));
        given(attendanceRepository.findById(new AttendanceId(USER_ID, LECTURE_ID)))
                .willReturn(Optional.empty());

        Attendance result = attendanceService.MarkAttendance(USER_ID, JOIN_CODE);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(USER_ID, result.getAttendanceId().getUserId());
        Assertions.assertEquals(LECTURE_ID, result.getAttendanceId().getLectureId());
        Assertions.assertNotNull(result.getScannedAt());
        verify(attendanceRepository).save(any(Attendance.class));
    }

    // --- getPresentUsers tests ---

    @Test
    void getPresentUsers_noAttendances_returnsEmptyList() {
        given(attendanceRepository.findByAttendanceIdLectureId(LECTURE_ID))
                .willReturn(Collections.emptyList());

        List<EnrolledUser> result = attendanceService.getPresentUsers(LECTURE_ID);

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    void getPresentUsers_happyPath_returnsUsers() {
        Attendance att1 = Attendance.builder()
                .attendanceId(new AttendanceId(USER_ID, LECTURE_ID))
                .scannedAt(new Timestamp(System.currentTimeMillis()))
                .build();
        Attendance att2 = Attendance.builder()
                .attendanceId(new AttendanceId(2L, LECTURE_ID))
                .scannedAt(new Timestamp(System.currentTimeMillis()))
                .build();

        given(attendanceRepository.findByAttendanceIdLectureId(LECTURE_ID))
                .willReturn(List.of(att1, att2));
        given(userRepository.findById(USER_ID)).willReturn(Optional.of(user));

        User user2 = User.builder()
                .id(2L).firstName("Jane").lastName("Smith").email("jane@example.com").build();
        given(userRepository.findById(2L)).willReturn(Optional.of(user2));

        List<EnrolledUser> result = attendanceService.getPresentUsers(LECTURE_ID);

        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("John", result.get(0).getFirstName());
        Assertions.assertEquals("Jane", result.get(1).getFirstName());
    }

    @Test
    void getPresentUsers_userNotFound_throws() {
        Attendance att = Attendance.builder()
                .attendanceId(new AttendanceId(999L, LECTURE_ID))
                .scannedAt(new Timestamp(System.currentTimeMillis()))
                .build();
        given(attendanceRepository.findByAttendanceIdLectureId(LECTURE_ID))
                .willReturn(List.of(att));
        given(userRepository.findById(999L)).willReturn(Optional.empty());

        Assertions.assertThrows(NoSuchElementException.class,
                () -> attendanceService.getPresentUsers(LECTURE_ID));
    }
}
