package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.Course;
import org.example.attendancebackend.entity.CourseTranslation;
import org.example.attendancebackend.entity.CourseTranslationId;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.CourseTranslationRepository;
import org.example.attendancebackend.util.LocaleUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseTranslationRepository translationRepository;

    public CourseService(
            CourseRepository courseRepository,
            CourseTranslationRepository translationRepository
    ) {
        this.courseRepository = courseRepository;
        this.translationRepository = translationRepository;
    }

    public Course getCourseById(Long id, Long teacherId, String requestedLocale) {
        Course course = courseRepository.findByIdAndTeacherId(id, teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        applyTranslation(course, requestedLocale);
        return course;
    }

    public List<Course> getCourses(Long teacherId, String requestedLocale, String instructionLanguageFilter) {
        List<Course> courses;
        if (instructionLanguageFilter == null || instructionLanguageFilter.isBlank()) {
            courses = courseRepository.findByTeacherId(teacherId);
        } else {
            courses = courseRepository.findByTeacherIdAndInstructionLanguage(
                    teacherId,
                    LocaleUtil.normalize(instructionLanguageFilter)
            );
        }
        applyTranslationsBatch(courses, requestedLocale);
        return courses;
    }

    @Transactional
    public Course saveCourse(Course course) {
        String name = course.getCourseName() != null ? course.getCourseName().trim() : "";
        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is mandatory");
        }
        String desc = course.getDescription() != null ? course.getDescription().trim() : "";
        if (desc.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is mandatory");
        }
        course.setCourseName(name);
        course.setDescription(desc);

        String def = course.getDefaultLocale() != null && !course.getDefaultLocale().isBlank()
                ? LocaleUtil.normalize(course.getDefaultLocale())
                : LocaleUtil.DEFAULT_LOCALE;
        course.setDefaultLocale(def);
        if (course.getInstructionLanguage() != null && !course.getInstructionLanguage().isBlank()) {
            course.setInstructionLanguage(LocaleUtil.normalize(course.getInstructionLanguage()));
        }

        Course toPersist = Course.builder()
                .id(course.getId())
                .teacherId(course.getTeacherId())
                .defaultLocale(def)
                .instructionLanguage(course.getInstructionLanguage())
                .build();

        Course saved = courseRepository.saveAndFlush(toPersist);

        CourseTranslation tr = translationRepository
                .findById(new CourseTranslationId(saved.getId(), def))
                .orElseGet(() -> CourseTranslation.builder()
                        .courseId(saved.getId())
                        .locale(def)
                        .build());
        tr.setCourseId(saved.getId());
        tr.setLocale(def);
        tr.setCourseName(course.getCourseName());
        tr.setDescription(course.getDescription());
        translationRepository.save(tr);

        Long teacherId = saved.getTeacherId();
        return getCourseById(saved.getId(), teacherId, def);
    }

    @Transactional
    public void deleteCourseById(Long id, Long teacherId) {
        if (!courseRepository.findByIdAndTeacherId(id, teacherId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        translationRepository.deleteByCourseId(id);
        courseRepository.deleteByIdAndTeacherId(id, teacherId);
    }

    /**
     * Resolves {@link Course#getCourseName()} and {@link Course#getDescription()} for API consumers (e.g. student dashboard).
     */
    public void applyTranslation(Course course, String requestedLocale) {
        if (course == null || course.getId() == null) {
            return;
        }
        String wanted = LocaleUtil.normalize(requestedLocale);
        List<CourseTranslation> rows = translationRepository.findByCourseId(course.getId());
        pickTranslation(course, rows, wanted);
    }

    public void applyTranslationsBatch(List<Course> courses, String requestedLocale) {
        if (courses == null || courses.isEmpty()) {
            return;
        }
        String wanted = LocaleUtil.normalize(requestedLocale);
        List<Long> ids = courses.stream().map(Course::getId).filter(Objects::nonNull).toList();
        List<CourseTranslation> all = translationRepository.findByCourseIdIn(ids);
        Map<Long, List<CourseTranslation>> byCourse = new HashMap<>();
        for (CourseTranslation t : all) {
            byCourse.computeIfAbsent(t.getCourseId(), k -> new ArrayList<>()).add(t);
        }
        for (Course c : courses) {
            pickTranslation(c, byCourse.getOrDefault(c.getId(), List.of()), wanted);
        }
    }

    private static void pickTranslation(Course course, List<CourseTranslation> rows, String requestedLocale) {
        if (rows.isEmpty()) {
            course.setCourseName("");
            course.setDescription("");
            return;
        }
        Map<String, CourseTranslation> byLoc = new HashMap<>();
        for (CourseTranslation r : rows) {
            byLoc.put(r.getLocale(), r);
        }
        CourseTranslation chosen = byLoc.get(requestedLocale);
        if (chosen == null) {
            chosen = byLoc.get(course.getDefaultLocale());
        }
        if (chosen == null) {
            chosen = rows.get(0);
        }
        course.setCourseName(chosen.getCourseName());
        course.setDescription(chosen.getDescription() != null ? chosen.getDescription() : "");
    }
}
