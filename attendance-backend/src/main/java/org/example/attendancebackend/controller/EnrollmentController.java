package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.EnrollmentUploadResult;
import org.example.attendancebackend.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/")
    public ResponseEntity<EnrollmentUploadResult> uploadEnrollments(
            @RequestParam("course_id") Long courseId,
            @RequestPart("file") MultipartFile file) {
        return new ResponseEntity<>(enrollmentService.enrollFromXml(courseId, file), HttpStatus.CREATED);
    }
}
