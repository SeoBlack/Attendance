package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.dto.EnrollmentUploadResult;
import org.example.attendancebackend.dto.OneStudentEnrollment;
import org.example.attendancebackend.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping()
    public ResponseEntity<EnrollmentUploadResult> uploadEnrollments(
            @RequestParam("course_id") Long courseId,
            @RequestPart("file") MultipartFile file) {
        return new ResponseEntity<>(enrollmentService.enrollFromXml(courseId, file), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<EnrolledUser>> getCourseEnrollments(
            @RequestParam("course_id") Long courseId
    ){
        return new ResponseEntity<>(enrollmentService.getCourseEnrollments(courseId), HttpStatus.OK);
    }

    @DeleteMapping()
    public ResponseEntity<String> deleteEnrollments(
            @RequestParam("course_id") Long courseId
    ){
        enrollmentService.deleteCourseEnrollments(courseId);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @PutMapping()
    public ResponseEntity<EnrollmentUploadResult> updateEnrollments(
            @RequestParam("course_id") Long courseId,
            @RequestBody OneStudentEnrollment studentinfo
            ){
        return new ResponseEntity<>(enrollmentService.enrollOneStudent(courseId, studentinfo), HttpStatus.OK);
    }
}
