package org.example.attendancebackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.attendancebackend.dto.StudentDashboardResponse;
import org.example.attendancebackend.dto.StudentHistoryResponse;
import org.example.attendancebackend.service.StudentDashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/student")
public class StudentDashboardController {
    private final StudentDashboardService studentDashboardService;

    public StudentDashboardController(StudentDashboardService studentDashboardService) {
        this.studentDashboardService = studentDashboardService;
    }

    @GetMapping("/dashboard")
    @ResponseStatus(HttpStatus.OK)
    public StudentDashboardResponse getDashboard(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("authUserId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return studentDashboardService.getDashboard(userId);
    }

    @GetMapping("/history")
    @ResponseStatus(HttpStatus.OK)
    public StudentHistoryResponse getHistory(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("authUserId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return studentDashboardService.getHistory(userId);
    }
}
