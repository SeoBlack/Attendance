package org.example.attendancebackend.entity;

public enum UserRole {
    TEACHER("teacher"),
    STUDENT("student");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    public static UserRole fromValue(String value) {
        if (value == null) return null;
        String normalized = value.trim().toLowerCase();
        for (UserRole role : values()) {
            if (role.value.equals(normalized)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown user role: " + value);
    }
}
