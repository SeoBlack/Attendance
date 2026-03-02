package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.dto.EnrollmentUploadResult;
import org.example.attendancebackend.dto.OneStudentEnrollment;
import org.example.attendancebackend.entity.EnrollmentId;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.repository.EnrollmentRepository;
import org.example.attendancebackend.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private User existingUser;

    @BeforeEach
    void init() {
        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setFirstName("Alice");
        existingUser.setLastName("Johnson");
        existingUser.setEmail("alice@example.com");
        existingUser.setRole(UserRole.STUDENT);
    }

    // --- enrollFromXml ---

    @Test
    void enrollFromXml_newUserAndEnrollment_returnsCorrectCounts() throws Exception {
        String xml = """
                <?xml version="1.0" encoding="UTF-8"?>
                <enrollments>
                    <student>
                        <first_name>Alice</first_name>
                        <last_name>Johnson</last_name>
                        <email>alice@example.com</email>
                    </student>
                </enrollments>""";
        MockMultipartFile file = new MockMultipartFile("file", "test.xml", "application/xml", xml.getBytes());

        given(userRepository.findByEmailIgnoreCase("alice@example.com")).willReturn(Optional.empty());
        given(userRepository.save(any())).willReturn(existingUser);
        given(enrollmentRepository.existsById(any(EnrollmentId.class))).willReturn(false);

        EnrollmentUploadResult result = enrollmentService.enrollFromXml(1L, file);

        Assertions.assertEquals(1, result.getNewUsers());
        Assertions.assertEquals(1, result.getNewEnrollments());
    }

    @Test
    void enrollFromXml_existingUserNewEnrollment_countsOnlyEnrollment() throws Exception {
        String xml = """
                <?xml version="1.0" encoding="UTF-8"?>
                <enrollments>
                    <student>
                        <first_name>Alice</first_name>
                        <last_name>Johnson</last_name>
                        <email>alice@example.com</email>
                    </student>
                </enrollments>""";
        MockMultipartFile file = new MockMultipartFile("file", "test.xml", "application/xml", xml.getBytes());

        given(userRepository.findByEmailIgnoreCase("alice@example.com")).willReturn(Optional.of(existingUser));
        given(enrollmentRepository.existsById(any(EnrollmentId.class))).willReturn(false);

        EnrollmentUploadResult result = enrollmentService.enrollFromXml(1L, file);

        Assertions.assertEquals(0, result.getNewUsers());
        Assertions.assertEquals(1, result.getNewEnrollments());
    }

    @Test
    void enrollFromXml_alreadyEnrolled_returnsZeros() throws Exception {
        String xml = """
                <?xml version="1.0" encoding="UTF-8"?>
                <enrollments>
                    <student>
                        <first_name>Alice</first_name>
                        <last_name>Johnson</last_name>
                        <email>alice@example.com</email>
                    </student>
                </enrollments>""";
        MockMultipartFile file = new MockMultipartFile("file", "test.xml", "application/xml", xml.getBytes());

        given(userRepository.findByEmailIgnoreCase("alice@example.com")).willReturn(Optional.of(existingUser));
        given(enrollmentRepository.existsById(any(EnrollmentId.class))).willReturn(true);

        EnrollmentUploadResult result = enrollmentService.enrollFromXml(1L, file);

        Assertions.assertEquals(0, result.getNewUsers());
        Assertions.assertEquals(0, result.getNewEnrollments());
    }

    @Test
    void enrollFromXml_invalidXml_throwsBadRequest() {
        MockMultipartFile file = new MockMultipartFile("file", "bad.xml", "application/xml", "not xml".getBytes());

        Assertions.assertThrows(ResponseStatusException.class,
                () -> enrollmentService.enrollFromXml(1L, file));
    }

    // --- getCourseEnrollments ---

    @Test
    void getCourseEnrollments_returnsListFromRepository() {
        Long courseId = 1L;
        List<EnrolledUser> enrolled = List.of(
                new EnrolledUser(1L, "Alice", "Johnson", "alice@example.com")
        );
        given(enrollmentRepository.findUsersByCourseId(courseId)).willReturn(enrolled);

        List<EnrolledUser> result = enrollmentService.getCourseEnrollments(courseId);

        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals("Alice", result.get(0).getFirstName());
    }

    // --- deleteCourseEnrollments ---

    @Test
    void deleteCourseEnrollments_callsRepository() {
        willDoNothing().given(enrollmentRepository).deleteByCourseId(1L);

        enrollmentService.deleteCourseEnrollments(1L);

        verify(enrollmentRepository).deleteByCourseId(1L);
    }

    // --- enrollOneStudent ---

    @Test
    void enrollOneStudent_newUserAndEnrollment_returnsCorrectCounts() {
        OneStudentEnrollment student = new OneStudentEnrollment("Alice", "Johnson", "alice@example.com");

        given(userRepository.findByEmailIgnoreCase("alice@example.com")).willReturn(Optional.empty());
        given(userRepository.save(any())).willReturn(existingUser);
        given(enrollmentRepository.existsById(any(EnrollmentId.class))).willReturn(false);

        EnrollmentUploadResult result = enrollmentService.enrollOneStudent(1L, student);

        Assertions.assertEquals(1, result.getNewUsers());
        Assertions.assertEquals(1, result.getNewEnrollments());
    }

    @Test
    void enrollOneStudent_existingUserNewEnrollment_countsOnlyEnrollment() {
        OneStudentEnrollment student = new OneStudentEnrollment("Alice", "Johnson", "alice@example.com");

        given(userRepository.findByEmailIgnoreCase("alice@example.com")).willReturn(Optional.of(existingUser));
        given(enrollmentRepository.existsById(any(EnrollmentId.class))).willReturn(false);

        EnrollmentUploadResult result = enrollmentService.enrollOneStudent(1L, student);

        Assertions.assertEquals(0, result.getNewUsers());
        Assertions.assertEquals(1, result.getNewEnrollments());
    }

    @Test
    void enrollOneStudent_alreadyEnrolled_returnsZeros() {
        OneStudentEnrollment student = new OneStudentEnrollment("Alice", "Johnson", "alice@example.com");

        given(userRepository.findByEmailIgnoreCase("alice@example.com")).willReturn(Optional.of(existingUser));
        given(enrollmentRepository.existsById(any(EnrollmentId.class))).willReturn(true);

        EnrollmentUploadResult result = enrollmentService.enrollOneStudent(1L, student);

        Assertions.assertEquals(0, result.getNewUsers());
        Assertions.assertEquals(0, result.getNewEnrollments());
    }

    // --- deleteById ---

    @Test
    void deleteById_callsRepository() {
        EnrollmentId id = new EnrollmentId(1L, 1L);

        enrollmentService.deleteById(id);

        verify(enrollmentRepository).deleteById(id);
    }
}