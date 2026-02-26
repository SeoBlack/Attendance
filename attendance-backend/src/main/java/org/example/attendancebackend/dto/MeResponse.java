package org.example.attendancebackend.dto;

public record MeResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String role
) {}
