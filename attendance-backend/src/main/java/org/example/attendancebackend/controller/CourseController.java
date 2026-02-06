package org.example.attendancebackend.controller;

import org.example.attendancebackend.dto.CourseDto;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping("/courses")
    public List<CourseDto> getCourses() {
        List<Course> courses = courseRepository.findAll();
        List<CourseDto> courseDtos = new ArrayList<>();
        for (Course course : courses) {
            courseDtos.add(new CourseDto(course.getId(), course.getCourseName(), course.getDescription()));
        }
        return courseDtos;
    }

    @GetMapping("/courses/{id}")
    public CourseDto getCourse(@PathVariable Long id){
//        return courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        Course course = courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        return new CourseDto(course.getId(), course.getCourseName(), course.getDescription());

    }

    @PostMapping("/courses")
    public CourseDto postCourse(@RequestBody CourseDto courseDto) {
        Course course = new Course();
        course.setCourseName(courseDto.getCourseName());
        course.setDescription(courseDto.getDescription());
        Course savedCourse = courseRepository.save(course);
        return new CourseDto(savedCourse.getId(), savedCourse.getCourseName(), savedCourse.getDescription());
    }
}
