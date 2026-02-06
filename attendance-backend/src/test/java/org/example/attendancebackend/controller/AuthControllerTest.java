package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void signup_shouldReturn201_whenRequestIsValid() throws Exception {
        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("firstName", "John")
                        .param("lastName", "Doe")
                        .param("role", "STUDENT")
                        .param("email", "john@example.com")
                        .param("password", "password123"))
                .andExpect(status().isCreated());
    }

    @Test
    void signup_shouldReturn500_whenUserAlreadyExists() throws Exception {
        User existing = new User();
        existing.setRole("TEACHER");
        existing.setFirstName("Jane");
        existing.setLastName("Smith");
        existing.setEmail("jane@example.com");
        existing.setPasswordHash("already_hashed_password");
        userRepository.save(existing);

        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("firstName", "Jane")
                        .param("lastName", "Smith")
                        .param("role", "TEACHER")
                        .param("email", "jane@example.com")
                        .param("password", "password123"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void signup_shouldReturn500_whenNamesAreEmpty() throws Exception {
        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("firstName", "")
                        .param("lastName", "")
                        .param("role", "STUDENT")
                        .param("email", "empty@example.com")
                        .param("password", "password123"))
                .andExpect(status().isInternalServerError());
    }
}
