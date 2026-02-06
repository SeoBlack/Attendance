package org.example.attendancebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "lectures")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lecture_id")
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "join_code", unique = true)
    private String joinCode;
    @Column(name = "description")
    private String description;
    @Column(name="start_date")
    private Timestamp startDate;
    @Column(name="end_date")
    private Timestamp endDate;
}
