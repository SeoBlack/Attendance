package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.CourseDto;
import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public CourseDto getCourseDtoById(Long id) {
        Course courseEntity = courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        return new CourseDto(courseEntity.getId(), courseEntity.getCourseName(), courseEntity.getDescription());
    }

    public List<CourseDto> getCourseDtos() {
        List<Course> courseEntities = courseRepository.findAll();
        List<CourseDto> courseDtos = new ArrayList<>();
        for (Course course : courseEntities) {
            courseDtos.add(CourseDto.builder().id(course.getId()).courseName(course.getCourseName()).description(course.getDescription()).build());
        }
        return courseDtos;
    }

    public CourseDto createCourseDto(CourseDto courseDto) {
        Course course = Course.builder().courseName(courseDto.getCourseName()).description(courseDto.getDescription()).build();
        Course savedCourse = courseRepository.save(course);
        return CourseDto.builder().id(savedCourse.getId()).courseName(savedCourse.getCourseName()).description(savedCourse.getDescription()).build();
    }
}
