package org.example.attendancebackend.controller;

import org.example.attendancebackend.config.JwtAuthInterceptor;
import org.example.attendancebackend.config.WebConfig;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.service.CourseService;
import org.example.attendancebackend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = CourseController.class,
        excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebConfig.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthInterceptor.class)
        }
)
@AutoConfigureMockMvc(addFilters = false)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CourseService courseService;

    @Autowired
    private ObjectMapper objectMapper;
    Course course;

    @BeforeEach
    public void init() {
        course = Course.builder().courseName("Math").description("Math is beautiful").teacherId(0L).build();
    }

    @Test
    void getCourses() throws Exception {
        Course course2 = Course.builder().courseName("Python").description("Python is practical").build();
        given(courseService.getCourses(null)).willReturn(List.of(course, course2));

        mockMvc.perform(MockMvcRequestBuilders.get("/courses")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].courseName").value("Math"))
                .andExpect(jsonPath("$[1].courseName").value("Python"));

    }

    @Test
    void getCourse() throws Exception {
        Long courseId = 1L;
        given(courseService.getCourseById(courseId, null)).willReturn(course);

        ResultActions response = mockMvc.perform(MockMvcRequestBuilders.get("/courses/{id}",courseId)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.courseName").value("Math"))
                .andExpect(jsonPath("$.description").value("Math is beautiful"));
    }

    @Test
    void createCourse() throws Exception {
        given(courseService.saveCourse(ArgumentMatchers.any())).willReturn(course);

        ResultActions response = mockMvc.perform(MockMvcRequestBuilders.post("/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(course)));

        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseName").value("Math"))
                .andExpect(jsonPath("$.description").value("Math is beautiful"));
    }

    @Test
    void updateCourse() throws Exception {
        course.setId(5L);
        given(courseService.saveCourse(ArgumentMatchers.any())).willReturn(course);

        ArgumentCaptor<Course> captor = ArgumentCaptor.forClass(Course.class);
        mockMvc.perform(MockMvcRequestBuilders.put("/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(course)))
                .andExpect(status().isOk());

        verify(courseService).saveCourse(captor.capture());
        Assertions.assertEquals(5L, captor.getValue().getId());
    }

    @Test
    void deleteCourse() throws Exception {
        Long courseId = 1L;
        // deleteCourseById returns void, so willDoNothing() is correct
        willDoNothing().given(courseService).deleteCourseById(courseId, 0L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/courses/{id}", courseId))
                .andExpect(status().isOk());
    }
}
