package org.example.attendancebackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.service.CourseService;
import org.example.attendancebackend.util.LocaleUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
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
    public ResponseEntity<List<Course>> getCourses(HttpServletRequest request) {
        String locale = LocaleUtil.resolveLocaleHeader(request.getHeader("Accept-Language"));
        return new ResponseEntity<>(
                courseService.getCourses((Long) request.getAttribute("authUserId"), locale),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id, HttpServletRequest request) {
        String locale = LocaleUtil.resolveLocaleHeader(request.getHeader("Accept-Language"));
        return new ResponseEntity<>(
                courseService.getCourseById(id, (Long) request.getAttribute("authUserId"), locale),
                HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course, HttpServletRequest request) {
        course.setId(null);
        course.setTeacherId((Long) request.getAttribute("authUserId"));
        applyContentLocaleFromHeaderIfMissing(course, request);
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED);
    }

    @PutMapping()
    public ResponseEntity<Course> updateCourse(@Valid @RequestBody Course course, HttpServletRequest request) {
        course.setTeacherId((Long) request.getAttribute("authUserId"));
        applyContentLocaleFromHeaderIfMissing(course, request);
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.OK);
    }

    /**
     * Which translation row to upsert: use JSON {@code defaultLocale} when sent, otherwise the UI locale from
     * {@code Accept-Language} (same as i18n on the client). Without this, missing {@code defaultLocale} defaulted to
     * {@code en} and Arabic text was stored under the English slot.
     */
    private static void applyContentLocaleFromHeaderIfMissing(Course course, HttpServletRequest request) {
        if (course.getDefaultLocale() == null || course.getDefaultLocale().isBlank()) {
            course.setDefaultLocale(LocaleUtil.resolveLocaleHeader(request.getHeader("Accept-Language")));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id, HttpServletRequest request){
        if(id == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        courseService.deleteCourseById(id, (Long) request.getAttribute("authUserId"));
        return new ResponseEntity<>("", HttpStatus.OK);
    }
}