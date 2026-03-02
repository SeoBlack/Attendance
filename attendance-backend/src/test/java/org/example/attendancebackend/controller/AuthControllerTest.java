package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.repository.UserRepository;
import org.example.attendancebackend.util.PasswordHasher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordHasher passwordHasher;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void signup_shouldReturn201_whenRequestIsValid() throws Exception {
        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson("John", "Doe", UserRole.STUDENT.getValue(), "john@example.com", "password123")))
                .andExpect(status().isCreated());
    }

    @Test
    void signup_shouldReturn500_whenUserAlreadyExists() throws Exception {
        User existing = new User();
        existing.setRole(UserRole.TEACHER);
        existing.setFirstName("Jane");
        existing.setLastName("Smith");
        existing.setEmail("jane@example.com");
        existing.setPasswordHash("already_hashed_password");
        userRepository.save(existing);

        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson("Jane", "Smith", UserRole.TEACHER.getValue(), "jane@example.com", "password123")))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void signup_shouldReturn500_whenNamesAreEmpty() throws Exception {
        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson("", "", UserRole.STUDENT.getValue(), "empty@example.com", "password123")))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void signin_shouldReturn200_whenCredentialsAreValid() throws Exception {
        User existing = new User();
        existing.setRole(UserRole.STUDENT);
        existing.setFirstName("John");
        existing.setLastName("Doe");
        existing.setEmail("john@example.com");
        existing.setPasswordHash(passwordHasher.hash("password123"));
        userRepository.save(existing);

        mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signinJson("john@example.com", "password123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(emptyOrNullString())));
    }

    @Test
    void signin_shouldReturn401_whenUserNotFound() throws Exception {
        mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signinJson("missing@example.com", "password123")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signin_shouldReturn401_whenPasswordIsWrong() throws Exception {
        User existing = new User();
        existing.setRole(UserRole.STUDENT);
        existing.setFirstName("John");
        existing.setLastName("Doe");
        existing.setEmail("john@example.com");
        existing.setPasswordHash(passwordHasher.hash("password123"));
        userRepository.save(existing);

        mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signinJson("john@example.com", "wrong_password")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signin_shouldReturn401_whenEmailOrPasswordIsEmpty() throws Exception {
        mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signinJson("", "password123")))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signinJson("john@example.com", "")))
                .andExpect(status().isUnauthorized());
    }


    @Test
    void me_shouldReturn401_withoutToken() throws Exception {
        mockMvc.perform(get("/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_shouldReturn200_withValidToken() throws Exception {
        User existing = new User();
        existing.setRole(UserRole.STUDENT);
        existing.setFirstName("John");
        existing.setLastName("Doe");
        existing.setEmail("john@example.com");
        existing.setPasswordHash(passwordHasher.hash("password123"));
        userRepository.save(existing);

        String body = mockMvc.perform(post("/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signinJson("john@example.com", "password123")))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = extractTokenFromSigninResponse(body);

        mockMvc.perform(get("/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existing.getId()))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.role").value(UserRole.STUDENT.getValue()));
    }

    @Test
    void me_shouldReturn401_withInvalidToken() throws Exception {
        mockMvc.perform(get("/me")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    private String signupJson(String firstName, String lastName, String role, String email, String password) {
        return String.format(
                "{\"firstName\":\"%s\",\"lastName\":\"%s\",\"role\":\"%s\",\"email\":\"%s\",\"password\":\"%s\"}",
                firstName, lastName, role, email, password
        );
    }

    private String signinJson(String email, String password) {
        return String.format(
                "{\"email\":\"%s\",\"password\":\"%s\"}",
                email, password
        );
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
}
