# Class Diagram

Reconstructed from [CLASS_DIAGRAM.pdf](/Users/levkaravanov/Dev/Attendance/docs/diagrams/CLASS_DIAGRAM.pdf) and aligned with the current backend code in [attendance-backend/src/main/java/org/example/attendancebackend](/Users/levkaravanov/Dev/Attendance/attendance-backend/src/main/java/org/example/attendancebackend).

## Domain Model

```mermaid
classDiagram
direction LR

class User {
  +Long id
  +UserRole role
  +String firstName
  +String lastName
  +String email
  +String passwordHash
  +String preferredLocale
}

class UserRole {
  <<enumeration>>
  TEACHER
  STUDENT
}

class Course {
  +Long id
  +String courseName
  +String description
  +Long teacherId
  +String defaultLocale
  +String instructionLanguage
}

class CourseTranslation {
  +Long courseId
  +String locale
  +String courseName
  +String description
}

class CourseTranslationId {
  +Long courseId
  +String locale
}

class Lecture {
  +Long id
  +Long courseId
  +String joinCode
  +String description
  +Timestamp startDate
  +Timestamp endDate
}

class Enrollment {
  +EnrollmentId id
  +User user
}

class EnrollmentId {
  +Long userId
  +Long courseId
}

class Attendance {
  +AttendanceId attendanceId
  +Timestamp scannedAt
}

class AttendanceId {
  +Long userId
  +Long lectureId
}

User --> UserRole : role
Course --> User : teacherId
Course "1" --> "0..*" Lecture : has
Course "1" --> "0..*" CourseTranslation : translations
CourseTranslation ..> CourseTranslationId : composite key

Enrollment *-- EnrollmentId : id
Enrollment --> User : student
Enrollment --> Course : course

Attendance *-- AttendanceId : id
Attendance --> User : student
Attendance --> Lecture : lecture
```

## REST Controllers Overview

```mermaid
flowchart TB
  subgraph Controllers
    AuthController
    CourseController
    LectureController
    EnrollmentController
    AttendanceController
    StudentDashboardController
  end

  subgraph Main_Domain_Concepts
    User
    Course
    CourseTranslation
    Lecture
    Enrollment
    Attendance
  end

  AuthController --> User
  CourseController --> Course
  CourseController --> CourseTranslation
  LectureController --> Lecture
  EnrollmentController --> Enrollment
  AttendanceController --> Attendance
  StudentDashboardController --> User
  StudentDashboardController --> Course
  StudentDashboardController --> Lecture
  StudentDashboardController --> Attendance
```

## Notes

- `Course.courseName` and `Course.description` are resolved localized API values; the persisted localized text lives in `CourseTranslation`.
- Compared to the PDF version, this source includes the newer localization-related model changes: `CourseTranslation`, `CourseTranslationId`, `Course.defaultLocale`, `Course.instructionLanguage`, and `User.preferredLocale`.
- If you need a single diagram for the report, use the `Domain Model` block as the main class diagram and keep the controller block as a supporting figure.
