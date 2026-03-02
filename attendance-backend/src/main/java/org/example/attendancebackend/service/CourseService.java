package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course getCourseById(Long id, Long teacherId) {
        return courseRepository.findByIdAndTeacherId(id, teacherId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    public List<Course> getCourses(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public Course saveCourse(Course course) {
        return courseRepository.saveAndFlush(course);
    }

    public void deleteCourseById(Long id, Long teacherId) {
        courseRepository.deleteByIdAndTeacherId(id, teacherId);
    }
}
