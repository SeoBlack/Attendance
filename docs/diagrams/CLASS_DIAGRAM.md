# Class Diagram

Reconstructed from [CLASS_DIAGRAM.pdf](/Users/levkaravanov/Dev/Attendance/docs/diagrams/CLASS_DIAGRAM.pdf) and aligned with the current backend code in [attendance-backend/src/main/java/org/example/attendancebackend](/Users/levkaravanov/Dev/Attendance/attendance-backend/src/main/java/org/example/attendancebackend).

## Core Domain Model

```mermaid
classDiagram
direction LR

class User {
  +Long id
  +UserRole role
  +String email
  +String preferredLocale
}

class UserRole {
  <<enumeration>>
  TEACHER
  STUDENT
}

class Course {
  +Long id
  +Long teacherId
  +String defaultLocale
  +String instructionLanguage
}

class CourseTranslation {
  +Long courseId
  +String locale
  +String courseName
}

class Lecture {
  +Long id
  +String joinCode
  +Timestamp startDate
  +Timestamp endDate
}

class Enrollment {
  +EnrollmentId id
}

class Attendance {
  +AttendanceId attendanceId
  +Timestamp scannedAt
}

User --> UserRole : role
Course --> User : teacherId
Course "1" --> "0..*" Lecture : has
Course "1" --> "0..*" CourseTranslation : translations
Enrollment --> User : student
Enrollment --> Course : course
Attendance --> User : student
Attendance --> Lecture : lecture
```

## Persistence Details

```mermaid
classDiagram
direction LR

class Enrollment {
  +EnrollmentId id
}

class EnrollmentId {
  +Long userId
  +Long courseId
}

class Attendance {
  +AttendanceId attendanceId
}

class AttendanceId {
  +Long userId
  +Long lectureId
}

class CourseTranslation {
  +Long courseId
  +String locale
  +String courseName
}

class CourseTranslationId {
  +Long courseId
  +String locale
}

Enrollment *-- EnrollmentId : composite key
Attendance *-- AttendanceId : composite key
CourseTranslation ..> CourseTranslationId : key class
```

## REST Controllers Overview

```mermaid
flowchart TB
  AuthController["AuthController"] --> User["User"]
  CourseController["CourseController"] --> Course["Course + CourseTranslation"]
  LectureController["LectureController"] --> Lecture["Lecture"]
  EnrollmentController["EnrollmentController"] --> Enrollment["Enrollment"]
  AttendanceController["AttendanceController"] --> Attendance["Attendance"]
  StudentDashboardController["StudentDashboardController"] --> Dashboard["Dashboard / History view"]
```

## Notes

- `Course.courseName` and `Course.description` are resolved localized API values; the persisted localized text lives in `CourseTranslation`.
- Compared to the PDF version, this source includes the newer localization-related model changes: `CourseTranslation`, `CourseTranslationId`, `Course.defaultLocale`, `Course.instructionLanguage`, and `User.preferredLocale`.
- The main diagram intentionally omits some helper classes and less important fields to keep Mermaid readable.
- `StudentDashboardController` works with user, course, lecture, and attendance data, but that dependency fan-out is summarized as `Dashboard / History view` to avoid a tangled graph.
- If you need a single figure for the report, use `Core Domain Model` as the main class diagram and keep the other two blocks as supporting figures.
