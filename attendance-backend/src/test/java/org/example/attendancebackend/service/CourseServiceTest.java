package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.CourseTranslation;
import org.example.attendancebackend.entity.CourseTranslationId;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.CourseTranslationRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {
    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseTranslationRepository translationRepository;

    @InjectMocks
    private CourseService courseService;

    Course course;

    @BeforeEach
    public void init() {
        course = Course.builder()
                .courseName("Math")
                .description("Math is beautiful")
                .teacherId(1L)
                .defaultLocale("en")
                .build();
    }

    @Test
    void getCourseReturnsCorrect() {
        Course persisted = Course.builder().id(1L).teacherId(1L).defaultLocale("en").build();
        given(courseRepository.findByIdAndTeacherId(1L, 1L)).willReturn(Optional.of(persisted));
        CourseTranslation tr = CourseTranslation.builder()
                .courseId(1L)
                .locale("en")
                .courseName("Math")
                .description("Math is beautiful")
                .build();
        given(translationRepository.findByCourseId(1L)).willReturn(List.of(tr));

        Course result = courseService.getCourseById(1L, 1L, "en");
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Math", result.getCourseName());
        Assertions.assertEquals("Math is beautiful", result.getDescription());
    }

    @Test
    void createsCourseAndReturns() {
        Course savedRow = Course.builder().id(5L).teacherId(1L).defaultLocale("en").build();
        given(courseRepository.saveAndFlush(any(Course.class))).willReturn(savedRow);
        given(translationRepository.findById(any(CourseTranslationId.class))).willReturn(Optional.empty());
        when(translationRepository.save(any(CourseTranslation.class))).thenAnswer(inv -> inv.getArgument(0));
        given(courseRepository.findByIdAndTeacherId(5L, 1L)).willReturn(Optional.of(savedRow));
        CourseTranslation tr = CourseTranslation.builder()
                .courseId(5L)
                .locale("en")
                .courseName("Math")
                .description("Math is beautiful")
                .build();
        given(translationRepository.findByCourseId(5L)).willReturn(List.of(tr));

        Course result = courseService.saveCourse(course);
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Math", result.getCourseName());
        Assertions.assertEquals("Math is beautiful", result.getDescription());
    }

    @Test
    void getAllCoursesReturns() {
        Course c1 = Course.builder().id(1L).teacherId(0L).defaultLocale("en").build();
        Course c2 = Course.builder().id(2L).teacherId(0L).defaultLocale("en").build();
        given(courseRepository.findByTeacherId(0L)).willReturn(List.of(c1, c2));
        CourseTranslation t1 = CourseTranslation.builder()
                .courseId(1L).locale("en").courseName("Math").description("Math is beautiful").build();
        CourseTranslation t2 = CourseTranslation.builder()
                .courseId(2L).locale("en").courseName("Python").description("Python is practice").build();
        given(translationRepository.findByCourseIdIn(List.of(1L, 2L))).willReturn(List.of(t1, t2));

        List<Course> result = courseService.getCourses(0L, "en");

        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("Math", result.get(0).getCourseName());
        Assertions.assertEquals("Python", result.get(1).getCourseName());
        Assertions.assertEquals("Math is beautiful", result.get(0).getDescription());
        Assertions.assertEquals("Python is practice", result.get(1).getDescription());
    }
}
