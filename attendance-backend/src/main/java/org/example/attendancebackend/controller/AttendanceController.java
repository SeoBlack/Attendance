package org.example.attendancebackend.controller;


import org.apache.tomcat.util.json.JSONParser;
import org.example.attendancebackend.entity.Attendance;
import org.example.attendancebackend.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.rmi.AlreadyBoundException;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    AttendanceService attendanceService;
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }
    //i guess this should receive the lecture joinCode from frontend, then the user Id from session, then do the logic
    @PostMapping(value = "/", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Attendance MarkAttendance(@RequestBody Map<String, String> body) {

        String joinCode = body.get("joinCode");
        System.out.println("joinCode:" + joinCode);

        //fake the user ID, This should be replaced with actual user ID when implemented in the session.
        Long userId = Long.parseLong("1");

        if (joinCode == null || joinCode.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lecture Code is invalid");
        }
        try {
            //handle logic in the service ( Right Alexei? )
            return attendanceService.MarkAttendance(userId, joinCode);
        } catch (Exception e) {
            e.printStackTrace();
            if(e instanceof NoSuchElementException){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);

            }
            else if(e instanceof IllegalAccessException || e instanceof IllegalArgumentException){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
            else if(e instanceof AlreadyBoundException){
                throw new ResponseStatusException(HttpStatus.ALREADY_REPORTED);
            }
            else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
