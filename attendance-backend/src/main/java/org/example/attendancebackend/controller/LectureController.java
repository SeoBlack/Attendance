package org.example.attendancebackend.controller;

import org.example.attendancebackend.entity.Lecture;
import org.example.attendancebackend.service.LectureService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
        return lectureService.getLecture(id);
    }

    @PostMapping(path="/lectures", consumes = "application/json") // I found out that this has to be set for spring boot to understand the request body
    @ResponseStatus(HttpStatus.CREATED)
    public Lecture createLecture(@RequestBody Lecture lecture) {
        return lectureService.createLecture(lecture);
    }

    @PutMapping(path = "/lectures/{id}", consumes = "application/json")
    public Lecture updateLecture(@PathVariable Long id, @RequestBody Lecture lecture) {
        return lectureService.updateLecture(id, lecture);
    }

    @DeleteMapping("/lectures/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLecture(@PathVariable Long id) {
        lectureService.deleteLecture(id);
    }


}
