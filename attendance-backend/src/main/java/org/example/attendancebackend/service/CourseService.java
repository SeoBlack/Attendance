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

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    public Course saveCourse(Course course) {
        return courseRepository.saveAndFlush(course);
    }

    public void deleteCourseById(Long id, Long teacherId) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        if (course.getTeacherId() != teacherId) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this course");
        }
        courseRepository.deleteById(id);
    }
}
