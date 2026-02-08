package org.example.attendancebackend.controllerTests;

import org.example.attendancebackend.controller.LectureController;
import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.example.attendancebackend.service.LectureService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.hasLength;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class LectureControllerTests {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private LectureRepository lectureRepository;

    @Mock
    private CourseRepository courseRepository;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        LectureService lectureService = new LectureService(lectureRepository, courseRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(new LectureController(lectureService))
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    @Test
    void getLectures_withCourseId_filtersByCourse() throws Exception {
        Lecture lecture = buildLecture(11L, 2L, "Week 2", timestamp(1_700_000_000_000L), timestamp(1_700_000_360_000L));
        when(lectureRepository.findByCourseId(2L)).thenReturn(List.of(lecture));

        mockMvc.perform(get("/lectures").queryParam("courseId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(11))
                .andExpect(jsonPath("$[0].courseId").value(2))
                .andExpect(jsonPath("$[0].description").value("Week 2"));
    }

    @Test
    void getLecture_unknownId_returnsNotFound() throws Exception {
        when(lectureRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/lectures/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createLecture_missingCourseId_returnsBadRequest() throws Exception {
        String payload = objectMapper.writeValueAsString(Map.of(
                "description", "Missing course",
                "startDate", 1_700_000_000_000L,
                "endDate", 1_700_000_360_000L
        ));

        mockMvc.perform(post("/lectures")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createLecture_courseNotFound_returnsNotFound() throws Exception {
        when(courseRepository.existsById(1L)).thenReturn(false);

        String payload = objectMapper.writeValueAsString(validLecturePayload(1L));

        mockMvc.perform(post("/lectures")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isNotFound());
        verify(lectureRepository, never()).save(any(Lecture.class));
    }

    @Test
    void createLecture_invalidDates_returnsBadRequest() throws Exception {
        String payload = objectMapper.writeValueAsString(Map.of(
                "courseId", 1L,
                "description", "Bad dates",
                "startDate", 1_700_000_360_000L,
                "endDate", 1_700_000_000_000L
        ));

        mockMvc.perform(post("/lectures")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
        verify(lectureRepository, never()).save(any(Lecture.class));
    }

    @Test
    void createLecture_validRequest_returnsCreatedLecture() throws Exception {
        when(courseRepository.existsById(1L)).thenReturn(true);
        when(lectureRepository.save(any(Lecture.class))).thenAnswer(invocation -> {
            Lecture saved = invocation.getArgument(0);
            saved.setId(42L);
            return saved;
        });

        String payload = objectMapper.writeValueAsString(validLecturePayload(1L));

        mockMvc.perform(post("/lectures")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.courseId").value(1))
                .andExpect(jsonPath("$.joinCode", hasLength(6)));
    }

    @Test
    void updateLecture_unknownId_returnsNotFound() throws Exception {
        when(lectureRepository.findById(10L)).thenReturn(Optional.empty());

        String payload = objectMapper.writeValueAsString(validLecturePayload(1L));

        mockMvc.perform(put("/lectures/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateLecture_courseNotFound_returnsNotFound() throws Exception {
        when(lectureRepository.findById(10L)).thenReturn(Optional.of(buildLecture(10L, 1L, "Old", timestamp(1_700_000_000_000L), timestamp(1_700_000_360_000L))));
        when(courseRepository.existsById(2L)).thenReturn(false);

        String payload = objectMapper.writeValueAsString(validLecturePayload(2L));

        mockMvc.perform(put("/lectures/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isNotFound());
        verify(lectureRepository, never()).save(any(Lecture.class));
    }

    @Test
    void updateLecture_invalidDates_returnsBadRequest() throws Exception {
        String payload = objectMapper.writeValueAsString(Map.of(
                "courseId", 1L,
                "description", "Bad dates",
                "startDate", 1_700_000_360_000L,
                "endDate", 1_700_000_000_000L
        ));

        mockMvc.perform(put("/lectures/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
        verify(lectureRepository, never()).save(any(Lecture.class));
    }

    @Test
    void updateLecture_validRequest_returnsUpdatedLecture() throws Exception {
        when(lectureRepository.findById(10L)).thenReturn(Optional.of(buildLecture(10L, 1L, "Old", timestamp(1_700_000_000_000L), timestamp(1_700_000_360_000L))));
        when(courseRepository.existsById(2L)).thenReturn(true);
        when(lectureRepository.save(any(Lecture.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String payload = objectMapper.writeValueAsString(validLecturePayload(2L));

        mockMvc.perform(put("/lectures/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.courseId").value(2))
                .andExpect(jsonPath("$.description").value("Lecture description"));
    }

    @Test
    void deleteLecture_unknownId_returnsNotFound() throws Exception {
        when(lectureRepository.existsById(10L)).thenReturn(false);

        mockMvc.perform(delete("/lectures/10"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteLecture_existingId_returnsNoContent() throws Exception {
        when(lectureRepository.existsById(10L)).thenReturn(true);

        mockMvc.perform(delete("/lectures/10"))
                .andExpect(status().isNoContent());
        verify(lectureRepository).deleteById(10L);
    }

    private static Lecture buildLecture(Long id, Long courseId, String description, Timestamp startDate, Timestamp endDate) {
        Lecture lecture = new Lecture();
        lecture.setId(id);
        lecture.setCourseId(courseId);
        lecture.setDescription(description);
        lecture.setStartDate(startDate);
        lecture.setEndDate(endDate);
        lecture.setJoinCode("ABC123");
        return lecture;
    }

    private static Timestamp timestamp(long epochMillis) {
        return new Timestamp(epochMillis);
    }

    private static Map<String, Object> validLecturePayload(Long courseId) {
        return Map.of(
                "courseId", courseId,
                "description", "Lecture description",
                "startDate", 1_700_000_000_000L,
                "endDate", 1_700_000_360_000L
        );
    }
}
