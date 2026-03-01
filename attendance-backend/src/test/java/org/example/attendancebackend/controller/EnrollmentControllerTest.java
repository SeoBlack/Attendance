
package org.example.attendancebackend.controller;

import org.example.attendancebackend.config.JwtAuthInterceptor;
import org.example.attendancebackend.config.WebConfig;
import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.dto.EnrollmentUploadResult;
import org.example.attendancebackend.dto.OneStudentEnrollment;
import org.example.attendancebackend.service.EnrollmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(controllers = EnrollmentController.class,
        excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebConfig.class),
                @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthInterceptor.class)
        })

@AutoConfigureMockMvc(addFilters = false)
public class EnrollmentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EnrollmentService enrollmentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void uploadEnrollments() throws Exception {
        Long courseId = 1L;
        given(enrollmentService.enrollFromXml(eq(courseId), any()))
                .willReturn(new EnrollmentUploadResult(3, 2));

        MockMultipartFile file = new MockMultipartFile(
                "file", "enrollments.xml", "application/xml",
                "<enrollments></enrollments>".getBytes()
        );

        mockMvc.perform(MockMvcRequestBuilders.multipart("/enrollments")
                        .file(file)
                        .param("course_id", courseId.toString()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.newEnrollments").value(3))
                .andExpect(jsonPath("$.newUsers").value(2));
    }

    @Test
    void getCourseEnrollments() throws Exception {
        Long courseId = 1L;
        given(enrollmentService.getCourseEnrollments(courseId)).willReturn(List.of(
                new EnrolledUser(1L, "Alice", "Johnson", "alice@example.com"),
                new EnrolledUser(2L, "Bob", "Smith", "bob@example.com")
        ));

        mockMvc.perform(MockMvcRequestBuilders.get("/enrollments")
                        .param("course_id", courseId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].firstName").value("Alice"))
                .andExpect(jsonPath("$[1].firstName").value("Bob"));
    }

    @Test
    void deleteEnrollments() throws Exception {
        Long courseId = 1L;
        willDoNothing().given(enrollmentService).deleteCourseEnrollments(courseId);

        mockMvc.perform(MockMvcRequestBuilders.delete("/enrollments")
                        .param("course_id", courseId.toString()))
                .andExpect(status().isOk());
    }

    @Test
    void enrollOneStudent() throws Exception {
        Long courseId = 1L;
        OneStudentEnrollment student = new OneStudentEnrollment("Alice", "Johnson", "alice@example.com");
        given(enrollmentService.enrollOneStudent(eq(courseId), any()))
                .willReturn(new EnrollmentUploadResult(1, 1));

        mockMvc.perform(MockMvcRequestBuilders.put("/enrollments")
                        .param("course_id", courseId.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.newEnrollments").value(1))
                .andExpect(jsonPath("$.newUsers").value(1));
    }

    @Test
    void deleteOneEnrollment() throws Exception {
        Long courseId = 1L;
        Long userId = 5L;
        willDoNothing().given(enrollmentService).deleteById(any());

        mockMvc.perform(MockMvcRequestBuilders.delete("/enrollments/{course_id}", courseId)
                        .param("user_id", userId.toString()))
                .andExpect(status().isOk());
    }
}
