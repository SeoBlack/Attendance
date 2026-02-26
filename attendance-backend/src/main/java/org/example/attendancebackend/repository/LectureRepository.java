package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourseId(Long courseId);
    Optional<Lecture> findByJoinCode(String joinCode);
}
