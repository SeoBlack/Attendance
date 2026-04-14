package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.entity.*;
import org.example.attendancebackend.repository.*;
import org.springframework.stereotype.Service;

import java.rmi.AlreadyBoundException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AttendanceService {
    AttendanceRepository attendanceRepository;
    CourseRepository courseRepository;
    LectureRepository lectureRepository;
    UserRepository userRepository;
    EnrollmentRepository enrollmentRepository;


    /**
     * Constructs AttendanceService with required repositories.
     * @param attendanceRepository repository for attendance records
     * @param courseRepository repository for courses
     * @param lectureRepository repository for lectures
     * @param userRepository repository for users
     * @param enrollmentRepository repository for enrollments
     */
    public AttendanceService(AttendanceRepository attendanceRepository,  CourseRepository courseRepository, LectureRepository lectureRepository,  UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.courseRepository = courseRepository;
        this.lectureRepository = lectureRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;

    }
    /**
     * Marks attendance for a student in a lecture identified by join code.
     * @param userId id of the user marking attendance
     * @param joinCode lecture join code
     * @return persisted Attendance entity
     * @throws IllegalAccessException if user is not enrolled in the course
     * @throws AlreadyBoundException if attendance already exists
     * @throws NoSuchElementException if user, lecture or course is not found
     */
    public Attendance MarkAttendance(Long userId, String joinCode) throws IllegalAccessException, AlreadyBoundException {
        //check if user is enrolled in the course
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
//        if(user.getRole() != UserRole.STUDENT) throw new IllegalArgumentException("Only Student can Mark Attendance"); should this be checked as well?
        Lecture lecture = lectureRepository.findByJoinCode(joinCode).orElseThrow(() ->  new NoSuchElementException("Lecture not found"));
        //check if course exists
        Course course = courseRepository.findById(lecture.getCourseId()).orElseThrow(() -> new NoSuchElementException("Course not found"));
        List<EnrolledUser> enrolledUsers = enrollmentRepository.findUsersByCourseId(course.getId());


        Attendance attendance = new Attendance(new AttendanceId(user.getId(), lecture.getId()),new Timestamp(System.currentTimeMillis()) );
        //check if student enrolled in course

        boolean enrollment = enrolledUsers.stream().anyMatch(u -> u.getId().equals(user.getId()));
        if(!enrollment){ //not enrolled, the enrollment should be replaced later with proper enrollment entity
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
    /**
     * Returns users who have marked attendance for the given lecture.
     * @param lectureId target lecture id
     * @return list of enrolled user DTOs present in the lecture
     * @throws NoSuchElementException if a referenced user is not found
     */
    public List<EnrolledUser> getPresentUsers(Long lectureId){
        try{
            //get attendances by lecture ID
            List<Attendance> list =  attendanceRepository.findByAttendanceIdLectureId(lectureId);
            List<EnrolledUser> users = new ArrayList<>();
            //for each attendance, get the user of that attendance
            for(Attendance attendance : list){
                Long userId = attendance.getAttendanceId().getUserId();
                User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
                users.add(new EnrolledUser(user.getId(), user.getFirstName(), user.getLastName(),  user.getEmail()));
            }
            return users;
        }
        catch (Exception e){
            throw e;
        }
    }

}
