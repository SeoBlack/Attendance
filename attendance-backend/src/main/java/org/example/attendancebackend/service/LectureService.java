package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.NoSuchElementException;
import java.util.List;



@Service
public class LectureService {
    private static final int CODE_SIZE = 6;
    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    public LectureService(LectureRepository lectureRepository, CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    public List<Lecture> getLectures(Long courseId) {
        if (courseId != null) {
            return lectureRepository.findByCourseId(courseId);
        }
        return lectureRepository.findAll();
    }

    public Lecture getLecture(Long id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Lecture not found"));
    }

    public Lecture createLecture(Lecture lecture) {
        // Validate that course exists
        if (!courseRepository.existsById(lecture.getCourseId())) {
            throw new NoSuchElementException("Course not found");
        }

        lecture.setJoinCode(generateRandomString());
        return lectureRepository.save(lecture);
    }

    public Lecture updateLecture(Long id, Lecture lecture) {
        Lecture existingLecture = lectureRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Lecture not found"));

        // Validate that course exists
        if (!courseRepository.existsById(lecture.getCourseId())) {
            throw new NoSuchElementException("Course not found");
        }

        // Update fields
        existingLecture.setCourseId(lecture.getCourseId());
        existingLecture.setDescription(lecture.getDescription());
        existingLecture.setStartDate(lecture.getStartDate());
        existingLecture.setEndDate(lecture.getEndDate());

        return lectureRepository.save(existingLecture);
    }

    public void deleteLecture(Long id) {
        if (!lectureRepository.existsById(id)) {
            throw new NoSuchElementException("Lecture not found");
        }
        lectureRepository.deleteById(id);
    }
    //generate a join code lecture specific(we could think of this later when implementing revalidation)
    private String generateRandomString() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder joinCode = new StringBuilder();
        for (int i = 0; i < CODE_SIZE; i++) {
            int index = RANDOM.nextInt(characters.length());
            joinCode.append(characters.charAt(index));
        }
        return joinCode.toString();
    }

}
