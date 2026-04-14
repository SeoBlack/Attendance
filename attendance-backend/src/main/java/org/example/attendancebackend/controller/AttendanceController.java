package org.example.attendancebackend.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.json.JSONParser;
import org.example.attendancebackend.dto.EnrolledUser;
import org.example.attendancebackend.entity.Attendance;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.rmi.AlreadyBoundException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/attendance")
@Slf4j
public class AttendanceController {

    AttendanceService attendanceService;
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }
    //i guess this should receive the lecture joinCode from frontend, then the user Id from session, then do the logic
    @PostMapping(value = "/", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Attendance MarkAttendance(@RequestBody Map<String, String> body, HttpServletRequest request) {

        String joinCode = body.get("joinCode");
        log.info("joinCode: {}", joinCode);

        Long userId = (Long) request.getAttribute("authUserId");

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }


        if (joinCode == null || joinCode.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lecture Code is invalid");
        }
        try {
            //handle logic in the service ( Right Alexei? )
            return attendanceService.MarkAttendance(userId, joinCode);
        } catch (Exception e) {
            log.error("Error while marking attendance", e);
            if(e instanceof NoSuchElementException){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            }
            else if(e instanceof IllegalAccessException || e instanceof IllegalArgumentException){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
            else if(e instanceof AlreadyBoundException){
                throw new ResponseStatusException(HttpStatus.CONFLICT);
            }
            else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    //get attendance for specific lecture
    //lecture ID should be passed to here through the body.
    @GetMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<EnrolledUser> getPresentStudents(@PathVariable Long id, HttpServletRequest request) {
        log.info("getPresentStudents: {}", id);
        Long lectureId = id;

        Long userId = (Long) request.getAttribute("authUserId");

        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (lectureId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lecture Id is invalid");
        }
        try{
            return attendanceService.getPresentUsers(lectureId);
        }
        catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
