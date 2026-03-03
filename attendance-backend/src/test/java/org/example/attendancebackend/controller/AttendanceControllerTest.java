package org.example.attendancebackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.attendancebackend.entity.*;
import org.example.attendancebackend.service.AttendanceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Timestamp;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AttendanceControllerTest {

    private static final String TEST_JOIN_CODE = "TEST-JOIN-CODE";

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private User testUser;
    private Course testCourse;
    private Lecture testLecture;

    @Mock
    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(new AttendanceController(attendanceService))
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();

        testUser = new User(1L, UserRole.STUDENT, "Test", "User", "test@example.com", "hash");
        testCourse = Course.builder()
                .id(100L)
                .courseName("Test Course")
                .description("Test course description")
                .build();
        testLecture = new Lecture(
                10L,
                testCourse.getId(),
                TEST_JOIN_CODE,
                "Test Lecture",
                new Timestamp(System.currentTimeMillis()),
                new Timestamp(System.currentTimeMillis() + 3600_000)
        );
    }

    /** Sets the authenticated user id on the request so the controller does not return 401. */
    private static RequestPostProcessor authUserId(long userId) {
        return request -> {
            request.setAttribute("authUserId", userId);
            return request;
        };
    }

    @Test
    void markAttendance_withValidJoinCode_returnsCreatedAndAttendance() throws Exception {
        Attendance attendance = buildAttendance(testUser.getId(), testLecture.getId());
        when(attendanceService.MarkAttendance(anyLong(), eq(TEST_JOIN_CODE))).thenReturn(attendance);

        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"" + TEST_JOIN_CODE + "\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.attendanceId.userId").value(testUser.getId()))
                .andExpect(jsonPath("$.attendanceId.lectureId").value(testLecture.getId()));
    }

    @Test
    void markAttendance_withNullJoinCode_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void markAttendance_withBlankJoinCode_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void markAttendance_withWhitespaceJoinCode_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"   \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void markAttendance_whenLectureNotFound_returnsNotFound() throws Exception {
        when(attendanceService.MarkAttendance(anyLong(), eq("INVALID")))
                .thenThrow(new java.util.NoSuchElementException("Lecture not found"));

        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"INVALID\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void markAttendance_whenStudentNotEnrolled_returnsForbidden() throws Exception {
        when(attendanceService.MarkAttendance(anyLong(), eq(TEST_JOIN_CODE)))
                .thenThrow(new IllegalAccessException("student not enrolled in the course"));

        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"" + TEST_JOIN_CODE + "\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void markAttendance_whenIllegalArgument_returnsForbidden() throws Exception {
        when(attendanceService.MarkAttendance(anyLong(), eq(TEST_JOIN_CODE)))
                .thenThrow(new IllegalArgumentException("Invalid"));

        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"" + TEST_JOIN_CODE + "\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void markAttendance_whenAlreadyMarked_returnsAlreadyReported() throws Exception {
        when(attendanceService.MarkAttendance(anyLong(), eq(TEST_JOIN_CODE)))
                .thenThrow(new java.rmi.AlreadyBoundException("student already marked"));

        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"" + TEST_JOIN_CODE + "\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void markAttendance_whenUnexpectedException_returnsInternalServerError() throws Exception {
        when(attendanceService.MarkAttendance(anyLong(), eq(TEST_JOIN_CODE)))
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(post("/attendance/")
                        .with(authUserId(testUser.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"joinCode\":\"" + TEST_JOIN_CODE + "\"}"))
                .andExpect(status().isInternalServerError());
    }

    private static Attendance buildAttendance(long userId, long lectureId) {
        return Attendance.builder()
                .attendanceId(new AttendanceId(userId, lectureId))
                .scannedAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }
}
