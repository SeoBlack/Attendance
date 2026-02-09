package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.repository.CourseRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    Course course;
    @BeforeEach
    public void init() {
        course = Course.builder().courseName("Math").description("Math is beautiful").build();
    }

    @Test
    void getCourseReturnsCorrect() {
        given(courseRepository.findById(1L)).willReturn(Optional.ofNullable(course));

        Course result = courseService.getCourseById(1L);
        Assertions.assertNotEquals(null, result);
        Assertions.assertEquals(course.getCourseName(), result.getCourseName());
        Assertions.assertEquals(course.getDescription(), result.getDescription());
    }

    @Test
    void createsCourseAndReturns() {
        given(courseRepository.save(course)).willReturn(course);

        Course result = courseService.createCourse(course);
        Assertions.assertNotEquals(null, result);
        Assertions.assertEquals(course.getCourseName(), result.getCourseName());
        Assertions.assertEquals(course.getDescription(), result.getDescription());
    }

    @Test
    void getAllCoursesReturns(){
        Course course1 = Course.builder().courseName("Python").description("Python is practice").build();

        given(courseRepository.findAll()).willReturn(List.of(course, course1));

        List<Course> result = courseService.getCourses();

        Assertions.assertNotEquals(null, result);
        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals(course.getCourseName(), result.get(0).getCourseName());
        Assertions.assertEquals(course1.getCourseName(), result.get(1).getCourseName());
        Assertions.assertEquals(course.getDescription(), result.get(0).getDescription());
        Assertions.assertEquals(course1.getDescription(), result.get(1).getDescription());
    }
}
