package org.example.attendancebackend.controller;

import jakarta.validation.Valid;
import org.example.attendancebackend.dto.CourseDto;
import org.example.attendancebackend.service.CourseService;
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

    public CourseController(CourseService courseService){
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
    public ResponseEntity<List<CourseDto>> getCourses() {
        return new ResponseEntity<>(courseService.getCourseDtos(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourse(@PathVariable Long id){
        return new ResponseEntity<>(courseService.getCourseDtoById(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<CourseDto> createCourse(@Valid @RequestBody CourseDto courseDto) {
        return new ResponseEntity<>(courseService.createCourseDto(courseDto), HttpStatus.CREATED) ;
    }
}
