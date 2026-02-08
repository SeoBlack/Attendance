package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.service.LectureService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;
import java.util.List;

@RestController
public class LectureController {

    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @GetMapping("/lectures")
    public List<Lecture> getLectures(@RequestParam(required = false) Long courseId) {
        return lectureService.getLectures(courseId);
    }

    @GetMapping("/lectures/{id}")
    public Lecture getLecture(@PathVariable Long id) {
        try {
            return lectureService.getLecture(id);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping(path="/lectures", consumes = "application/json") // I found out that this has to be set for spring boot to understand the request body
    @ResponseStatus(HttpStatus.CREATED)
    public Lecture createLecture(@RequestBody Lecture lecture) {
        validateLectureInput(lecture);
        try {
            return lectureService.createLecture(lecture);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid lecture data: " + e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create lecture");
        }
    }

    @PutMapping(path = "/lectures/{id}", consumes = "application/json")
    public Lecture updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
        validateLectureInput(lecture);
        try {
            return lectureService.updateLecture(id, lecture);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid lecture data: " + e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update lecture");
        }
    }

    @DeleteMapping("/lectures/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLecture(@PathVariable Long id) {
        try {
            lectureService.deleteLecture(id);
        } catch (NoSuchElementException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    private void validateLectureInput(Lecture lecture) {
        if (lecture.getCourseId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing course id");
        }

        if (lecture.getStartDate() == null || lecture.getEndDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start date and end date are required");
        }

        if (lecture.getEndDate().before(lecture.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be after start date");
        }
    }


}
