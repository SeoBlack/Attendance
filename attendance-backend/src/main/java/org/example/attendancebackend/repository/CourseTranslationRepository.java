package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.CourseTranslation;
import org.example.attendancebackend.entity.CourseTranslationId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface CourseTranslationRepository extends JpaRepository<CourseTranslation, CourseTranslationId> {

    List<CourseTranslation> findByCourseId(Long courseId);

    List<CourseTranslation> findByCourseIdIn(Collection<Long> courseIds);

    void deleteByCourseId(Long courseId);
}
