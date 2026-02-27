package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Enrollment;
import org.example.attendancebackend.entity.EnrollmentId;
import org.example.attendancebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    @Query("SELECT u FROM User u WHERE u.id IN " +
            "(SELECT e.id.userId FROM Enrollment e WHERE e.id.courseId = :courseId)")
    List<User> findUsersByCourseId(@Param("courseId") Long courseId);
}
