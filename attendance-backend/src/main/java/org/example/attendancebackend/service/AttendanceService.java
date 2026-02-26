package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.*;
import org.example.attendancebackend.repository.AttendanceRepository;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.example.attendancebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.rmi.AlreadyBoundException;
import java.sql.Timestamp;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AttendanceService {
    AttendanceRepository attendanceRepository;
    CourseRepository courseRepository;
    LectureRepository lectureRepository;
    UserRepository userRepository;


    public AttendanceService(AttendanceRepository attendanceRepository,  CourseRepository courseRepository, LectureRepository lectureRepository,  UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.courseRepository = courseRepository;
        this.lectureRepository = lectureRepository;
        this.userRepository = userRepository;

    }
    public Attendance MarkAttendance(Long userId, String joinCode) throws IllegalAccessException, AlreadyBoundException {
        //check if user is enrolled in the course
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
//        if(user.getRole() != UserRole.STUDENT) throw new IllegalArgumentException("Only Student can Mark Attendance"); should this be checked as well?
        Lecture lecture = lectureRepository.findByJoinCode(joinCode).orElseThrow(() ->  new NoSuchElementException("Lecture not found"));
        //check if course exists
        Course course = courseRepository.findById(lecture.getCourseId()).orElseThrow(() -> new NoSuchElementException("Course not found"));
        Attendance attendance = new Attendance(new AttendanceId(user.getId(), lecture.getId()),new Timestamp(System.currentTimeMillis()) );
        //TODO: implement enrollment and update this to get the enrolled USer
        //Enrollment enrollment = enrollmentRepository.findByUserIdLectureId(userId=user.getUserId, lecture.getLectureId).orElseThrow(() -> new IllegalArgumentException("Course not found"))  //smth like that;
        //check if student enrolled in course
        boolean enrollment = true;
        if( enrollment == false  ){ //not enrolled, the enrollment should be replaced later with proper enrollment entity
            throw new IllegalAccessException("student not enrolled in the course");

        }
        //check if already marked
        Optional<Attendance> exists = attendanceRepository.findById(new AttendanceId(user.getId(), lecture.getId()));
        if(exists.isPresent()){
            throw new AlreadyBoundException("student already enrolled in the course");
        }
        //create attendance
        try{
            attendanceRepository.save(attendance);
            return attendance;

        }
        catch (Exception e){
            throw e;
        }

    }

}
