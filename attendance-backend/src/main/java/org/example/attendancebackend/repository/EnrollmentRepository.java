package org.example.attendancebackend.repository;

import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.entity.Enrollment;
import org.example.attendancebackend.entity.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    @Query("SELECT new org.example.attendancebackend.dto.EnrolledUser(u.id, u.firstName, u.lastName, u.email) " +
            "FROM User u WHERE u.id IN " +
            "(SELECT e.id.userId FROM Enrollment e WHERE e.id.courseId = :courseId)")
    List<EnrolledUser> findUsersByCourseId(@Param("courseId") Long courseId);

    @Modifying
    @Query("DELETE FROM Enrollment e WHERE e.id.courseId = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);

}
