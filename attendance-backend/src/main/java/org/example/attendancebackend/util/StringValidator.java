package org.example.attendancebackend.util;

public class StringValidator {
    public static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}
