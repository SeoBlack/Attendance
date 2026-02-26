package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class JwtProtectedEndpointsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private PasswordHasher passwordHasher;

    @BeforeEach
    void setUp() {
        lectureRepository.deleteAll();
        courseRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void postCourses_shouldReturn401_withoutToken() throws Exception {
        mockMvc.perform(post("/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validCoursePayload()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postCourses_shouldReturn401_withInvalidToken() throws Exception {
        mockMvc.perform(post("/courses")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validCoursePayload()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postCourses_shouldReturn201_withValidToken() throws Exception {
        String token = createAndSigninUser();

        mockMvc.perform(post("/courses")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validCoursePayload()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseName").value("Math"))
                .andExpect(jsonPath("$.description").value("Linear algebra"));
    }

    @Test
    void postLectures_shouldReturn401_withoutToken() throws Exception {
        Course course = courseRepository.saveAndFlush(buildCourse("Course for lecture"));

        mockMvc.perform(post("/lectures")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validLecturePayload(course.getId())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postLectures_shouldReturn401_withInvalidToken() throws Exception {
        Course course = courseRepository.saveAndFlush(buildCourse("Course for lecture"));

        mockMvc.perform(post("/lectures")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validLecturePayload(course.getId())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postLectures_shouldReturn201_withValidToken() throws Exception {
        String token = createAndSigninUser();
        Course course = courseRepository.saveAndFlush(buildCourse("Course for lecture"));

        mockMvc.perform(post("/lectures")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validLecturePayload(course.getId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseId").value(course.getId()))
                .andExpect(jsonPath("$.joinCode", not(emptyOrNullString())));
    }

    @Test
    void putLectures_shouldReturn401_withoutToken() throws Exception {
        Course course = courseRepository.saveAndFlush(buildCourse("Course for update"));
        Lecture lecture = lectureRepository.saveAndFlush(buildLecture(course.getId()));

        mockMvc.perform(put("/lectures/{id}", lecture.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validLecturePayload(course.getId())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void putLectures_shouldReturn401_withInvalidToken() throws Exception {
        Course course = courseRepository.saveAndFlush(buildCourse("Course for update"));
        Lecture lecture = lectureRepository.saveAndFlush(buildLecture(course.getId()));

        mockMvc.perform(put("/lectures/{id}", lecture.getId())
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validLecturePayload(course.getId())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void putLectures_shouldReturn200_withValidToken() throws Exception {
        String token = createAndSigninUser();
        Course course = courseRepository.saveAndFlush(buildCourse("Course for update"));
        Lecture lecture = lectureRepository.saveAndFlush(buildLecture(course.getId()));

        mockMvc.perform(put("/lectures/{id}", lecture.getId())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validLecturePayload(course.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(lecture.getId()))
                .andExpect(jsonPath("$.courseId").value(course.getId()));
    }

    @Test
    void deleteLectures_shouldReturn401_withoutToken() throws Exception {
        Course course = courseRepository.saveAndFlush(buildCourse("Course for delete"));
        Lecture lecture = lectureRepository.saveAndFlush(buildLecture(course.getId()));

        mockMvc.perform(delete("/lectures/{id}", lecture.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteLectures_shouldReturn401_withInvalidToken() throws Exception {
        Course course = courseRepository.saveAndFlush(buildCourse("Course for delete"));
        Lecture lecture = lectureRepository.saveAndFlush(buildLecture(course.getId()));

        mockMvc.perform(delete("/lectures/{id}", lecture.getId())
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteLectures_shouldReturn204_withValidToken() throws Exception {
        String token = createAndSigninUser();
        Course course = courseRepository.saveAndFlush(buildCourse("Course for delete"));
        Lecture lecture = lectureRepository.saveAndFlush(buildLecture(course.getId()));

        mockMvc.perform(delete("/lectures/{id}", lecture.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    private String createAndSigninUser() throws Exception {
        User existing = new User();
        existing.setRole(UserRole.TEACHER);
        existing.setFirstName("Jane");
        existing.setLastName("Doe");
        existing.setEmail("jane@example.com");
        existing.setPasswordHash(passwordHasher.hash("password123"));
        userRepository.saveAndFlush(existing);

        String body = mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"jane@example.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return extractTokenFromSigninResponse(body);
    }

    private String extractTokenFromSigninResponse(String body) {
        int keyIndex = body.indexOf("\"token\":\"");
        if (keyIndex < 0) {
            throw new IllegalStateException("Token field is missing in /signin response");
        }

        int valueStart = keyIndex + "\"token\":\"".length();
        int valueEnd = body.indexOf('"', valueStart);
        if (valueEnd < 0) {
            throw new IllegalStateException("Token field format is invalid in /signin response");
        }

        return body.substring(valueStart, valueEnd);
    }

    private Course buildCourse(String name) {
        Course course = new Course();
        course.setCourseName(name);
        course.setDescription("Course description");
        return course;
    }

    private Lecture buildLecture(Long courseId) {
        Lecture lecture = new Lecture();
        lecture.setCourseId(courseId);
        lecture.setDescription("Lecture");
        lecture.setStartDate(new Timestamp(1_700_000_000_000L));
        lecture.setEndDate(new Timestamp(1_700_000_360_000L));
        lecture.setJoinCode("DEL123");
        return lecture;
    }

    private String validCoursePayload() {
        return "{\"courseName\":\"Math\",\"description\":\"Linear algebra\"}";
    }

    private String validLecturePayload(Long courseId) {
        return String.format(
                "{\"courseId\":%d,\"description\":\"Lecture 1\",\"startDate\":1700000000000,\"endDate\":1700000360000}",
                courseId
        );
    }
}
