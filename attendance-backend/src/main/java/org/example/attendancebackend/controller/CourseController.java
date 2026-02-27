package org.example.attendancebackend.controller;

import jakarta.validation.Valid;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.service.CourseService;
import org.example.attendancebackend.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public CourseController(CourseService courseService,  EnrollmentService enrollmentService) {

        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    @GetMapping()
    public ResponseEntity<List<Course>> getCourses() {
        return new ResponseEntity<>(courseService.getCourses(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id){
        return new ResponseEntity<>(courseService.getCourseById(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        course.setId(null);
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED) ;
    }

    @PostMapping("/enrollments")
    public ResponseEntity<String> uploadEnrollments(
            @RequestParam("course_id") Long courseId,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(enrollmentService.enrollFromXml(courseId, file));
    }


    @PutMapping()
    public ResponseEntity<Course> updateCourse(@Valid @RequestBody Course course) {
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED) ;
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id){
        if(id == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        courseService.deleteCourseById(id);
        return new ResponseEntity<>("", HttpStatus.OK);
    }
}
