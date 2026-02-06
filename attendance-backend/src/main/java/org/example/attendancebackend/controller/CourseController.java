package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping("/courses")
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/courses/{id}")
    public Course getCourse(@PathVariable Long id){
        return courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    @PostMapping(path="/courses",consumes = "application/json")
    public Course postCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }
}
