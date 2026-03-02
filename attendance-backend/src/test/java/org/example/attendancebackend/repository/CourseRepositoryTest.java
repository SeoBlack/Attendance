package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Course;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class CourseRepositoryTest {

    @Autowired
    private CourseRepository courseRepository;

    private Course course;
    Course savedCourse;

    @BeforeEach
    public void init() {
        course = Course.builder().courseName("Math").description("Math is beautiful").teacherId(0L).build();
        savedCourse = courseRepository.save(course);
    }

    @Test
    public void CourseRepository_Save_ReturnsSavedCourse(){
        Assertions.assertNotEquals(null, savedCourse);
        Assertions.assertTrue(savedCourse.getId()>0);
    }

    @Test
    public void CourseRepository_GetAll_ReturnsMoreThanOne(){
        Course course2 = Course.builder().courseName("Python").description("Python is practical").teacherId(0L).build();
        courseRepository.save(course2);

        List<Course> courses = courseRepository.findAll();

        Assertions.assertNotEquals(null, courses);
        Assertions.assertEquals(2, courses.size());
    }

    @Test
    public void CourseRepository_FindById_ReturnsOne(){
        Course returnedCourse = courseRepository.findById(savedCourse.getId()).orElse(null);

        Assertions.assertNotNull(returnedCourse);
        Assertions.assertNotEquals(null, returnedCourse.getId());
        Assertions.assertEquals(course.getCourseName(), returnedCourse.getCourseName());
    }
}
