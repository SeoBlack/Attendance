package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.CourseTranslation;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
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

    @Autowired
    private CourseTranslationRepository courseTranslationRepository;

    @Autowired
    private UserRepository userRepository;

    private Course course;
    Course savedCourse;

    @BeforeEach
    public void init() {
        User teacher = new User();
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("T");
        teacher.setLastName("T");
        teacher.setEmail("t@course-repo.test");
        teacher.setPasswordHash("x");
        userRepository.save(teacher);

        course = Course.builder().teacherId(teacher.getId()).defaultLocale("en").build();
        savedCourse = courseRepository.save(course);
        CourseTranslation tr = new CourseTranslation();
        tr.setCourseId(savedCourse.getId());
        tr.setLocale("en");
        tr.setCourseName("Math");
        tr.setDescription("Math is beautiful");
        courseTranslationRepository.save(tr);
    }

    @Test
    public void CourseRepository_Save_ReturnsSavedCourse() {
        Assertions.assertNotNull(savedCourse);
        Assertions.assertTrue(savedCourse.getId() > 0);
    }

    @Test
    public void CourseRepository_GetAll_ReturnsMoreThanOne() {
        User teacher = userRepository.findAll().get(0);
        Course course2 = Course.builder().teacherId(teacher.getId()).defaultLocale("en").build();
        Course saved2 = courseRepository.save(course2);
        CourseTranslation tr2 = new CourseTranslation();
        tr2.setCourseId(saved2.getId());
        tr2.setLocale("en");
        tr2.setCourseName("Python");
        tr2.setDescription("Python is practical");
        courseTranslationRepository.save(tr2);

        List<Course> courses = courseRepository.findAll();

        Assertions.assertNotNull(courses);
        Assertions.assertEquals(2, courses.size());
    }

    @Test
    public void CourseRepository_FindById_ReturnsOne() {
        Course returnedCourse = courseRepository.findById(savedCourse.getId()).orElse(null);

        Assertions.assertNotNull(returnedCourse);
        Assertions.assertNotNull(returnedCourse.getId());
        List<CourseTranslation> tr = courseTranslationRepository.findByCourseId(returnedCourse.getId());
        Assertions.assertEquals(1, tr.size());
        Assertions.assertEquals("Math", tr.get(0).getCourseName());
    }
}
