package org.example.attendancebackend.repository;

import org.example.attendancebackend.entity.Enrollment;
import org.example.attendancebackend.entity.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
}
