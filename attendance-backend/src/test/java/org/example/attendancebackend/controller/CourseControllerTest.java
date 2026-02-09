package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CourseController.class)
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
        course = Course.builder().courseName("Math").description("Math is beautiful").build();
    }

    @Test
    void getCourses() throws Exception {
        Course course2 = Course.builder().courseName("Python").description("Python is practical").build();
        given(courseService.getCourses()).willReturn(List.of(course, course2));

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
        given(courseService.getCourseById(courseId)).willReturn(course);

        ResultActions response = mockMvc.perform(MockMvcRequestBuilders.get("/courses/{id}",courseId)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.courseName").value("Math"))
                .andExpect(jsonPath("$.description").value("Math is beautiful"));
    }

    @Test
    void createCourse() throws Exception {
        given(courseService.createCourse(ArgumentMatchers.any())).willReturn(course);

        ResultActions response = mockMvc.perform( MockMvcRequestBuilders.post("/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(course)));

        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseName").value("Math"))
                .andExpect(jsonPath("$.description").value("Math is beautiful"));;
    }
}