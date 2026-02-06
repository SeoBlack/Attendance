package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.repository.CourseRepository;
import org.example.attendancebackend.repository.LectureRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Random;

@RestController
public class LectureController {

    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    public LectureController(LectureRepository lectureRepository, CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    @GetMapping("/lectures")
    public List<Lecture> getLectures(@RequestParam(required = false) Long courseId) {
        if (courseId != null) {
            return lectureRepository.findByCourseId(courseId);
        }
        return lectureRepository.findAll();
    }

    @GetMapping("/lectures/{id}")
    public Lecture getLecture(@PathVariable Long id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecture not found"));
    }

    @PostMapping(path="/lectures", consumes = "application/json") // I found out that this has to be set for spring boot to understand the request body
    @ResponseStatus(HttpStatus.CREATED)
    public Lecture createLecture(@RequestBody Lecture lecture) {
        if(lecture.getCourseId() == null) {
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

        //generate a join code lecture specific(we could think of this later when implementing revalidation)
        lecture.setJoinCode(generateRandomString(6));

        try {
            return lectureRepository.save(lecture);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid lecture data: " + e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create lecture");
        }
    }

    @PutMapping(path = "/lectures/{id}", consumes = "application/json")
    public Lecture updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
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

    @DeleteMapping("/lectures/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLecture(@PathVariable Long id) {
        if (!lectureRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecture not found");
        }
        lectureRepository.deleteById(id);
    }

    //generate a join code lecture specific
    private String generateRandomString(int length) {
        Random random = new Random();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder joinCode = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            joinCode.append(characters.charAt(index));
        }
        return joinCode.toString();
    }
}
