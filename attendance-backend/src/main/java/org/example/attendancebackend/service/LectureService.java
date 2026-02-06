package org.example.attendancebackend.service;

import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Random;



@Service
public class LectureService {
    private final int codeSize = 6;
    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecture not found"));
    }

    public Lecture createLecture(Lecture lecture) {
        if (lecture.getCourseId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing course id");
        }

        // Validate that course exists
        if (!courseRepository.existsById(lecture.getCourseId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }

        // Validate dates
        if (lecture.getStartDate() == null || lecture.getEndDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date and end date are required");
        }

        if (lecture.getEndDate().before(lecture.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be after start date");
        }

        lecture.setJoinCode(generateRandomString());
        try {
            return lectureRepository.save(lecture);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid lecture data: " + e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create lecture");
        }
    }

    public Lecture updateLecture(Long id, Lecture lecture) {
        Lecture existingLecture = lectureRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecture not found"));

        // Validate that course exists
        if (!courseRepository.existsById(lecture.getCourseId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }

        // Validate dates
        if (lecture.getStartDate() == null || lecture.getEndDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date and end date are required");
        }

        if (lecture.getEndDate().before(lecture.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be after start date");
        }

        // Update fields
        existingLecture.setCourseId(lecture.getCourseId());
        existingLecture.setDescription(lecture.getDescription());
        existingLecture.setStartDate(lecture.getStartDate());
        existingLecture.setEndDate(lecture.getEndDate());

        try {
            return lectureRepository.save(existingLecture);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid lecture data: " + e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update lecture");
        }
    }

    public void deleteLecture(Long id) {
        if (!lectureRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecture not found");
        }
        lectureRepository.deleteById(id);
    }
    //generate a join code lecture specific(we could think of this later when implementing revalidation)
    private String generateRandomString() {
        Random random = new Random();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder joinCode = new StringBuilder();
        for (int i = 0; i < this.codeSize; i++) {
            int index = random.nextInt(characters.length());
            joinCode.append(characters.charAt(index));
        }
        return joinCode.toString();
    }

}
