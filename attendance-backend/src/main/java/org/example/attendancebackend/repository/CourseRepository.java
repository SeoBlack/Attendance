package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    Optional<Course> findByIdAndTeacherId(Long id, Long teacherId);

    void deleteByIdAndTeacherId(Long id, Long teacherId);

}
