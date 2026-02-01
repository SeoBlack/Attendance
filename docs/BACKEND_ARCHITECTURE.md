# Backend Architecture for "Attendance" Project

This document describes the structure and components of the backend attendance tracking system. The project is developed as an educational assignment, focusing on simplicity of implementation and understanding.

## 1. Technology Stack and Principles
*   **Language**: Java 17+
*   **Framework**: Spring Boot (Web, Data JPA)
*   **Database**: H2 (for development) / MySQL / PostgreSQL (optional)
*   **Build Tool**: Maven
*   **Security**: Simplified, manual password hash verification (without Spring Security Filter Chain).

## 2. Package Structure
Root Package: `org.example.attendancebackend`

```text
src/main/java/org/example/attendancebackend/
├── config/              # Configuration classes (Cors, etc.)
├── controller/          # REST Controllers (Endpoints)
├── dto/                 # Data Transfer Objects (Request/Response)
├── entity/              # JPA Entities (correspond to DB tables)
├── repository/          # Data Access Interfaces (Spring Data JPA)
├── service/             # Business Logic
└── exception/           # Error Handling (Global Exception Handler)
```

## 3. System Components

### 3.1. Entities
Classes in the `entity` package, mapping tables from `schema.sql`.

*   **`User`** (`USERS`):
    *   Fields: `id` (UserID), `role` (Role), `firstName`, `secondName`, `email`, `passwordHash`.
    *   *Important*: `Role` can be an Enum (`STUDENT`, `TEACHER`).
*   **`Course`** (`COURSE`):
    *   Fields: `id` (CourseID), `courseName`, `description`.
*   **`Lecture`** (`LECTURE`):
    *   Fields: `id` (LectureID), `course` (ManyToOne), `description`, `lectureDate`.
*   **`Enrollment`** (`ENROLLMENTS`):
    *   Links `User` and `Course`.
    *   In JPA, it is better to use a composite key (`@Embeddable` or `@IdClass`) or add a surrogate ID.
*   **`Attendance`** (`ATTENDANCE`):
    *   Links `User` and `Lecture`.
    *   Fields: `user`, `lecture`, `scannedAt`.

### 3.2. Repositories
Interfaces in the `repository` package, extending `JpaRepository<Entity, Long>`.

*   `UserRepository`: method `Optional<User> findByEmail(String email);`
*   `CourseRepository`
*   `LectureRepository`
*   `EnrollmentRepository`
*   `AttendanceRepository`

### 3.3. DTO (Data Transfer Objects)
Package `dto` for API cleanliness.

*   `LoginRequest`: `email`, `password`.
*   `RegisterRequest`: `email`, `password`, `firstName`, `secondName`, `role`.
*   `UserResponse`: `id`, `name`, `role` (without password!).
*   `AttendanceRequest`: `lectureId`, `studentId` (if manual) or just `code`.

### 3.4. Services
Package `service`.

*   **`AuthService`**:
    *   `register(RegisterRequest req)`: Checks if email exists. Hashes password (e.g., SHA-256). Saves `User`.
    *   `login(LoginRequest req)`: Finds user by email. Hashes the incoming password. Compares `hash(inputPwd) == dbHash`. If they match, returns `User`.
*   **`CourseService`**: creating courses, getting the list.
*   **`AttendanceService`**: Student attendance logic. Verifies that the student is enrolled in the course of this lecture.

### 3.5. Controllers
Package `controller`, REST API.

*   **`AuthController`**:
    *   `POST /api/auth/register`
    *   `POST /api/auth/login`
*   **`CourseController`**:
    *   `GET /api/courses`
    *   `POST /api/courses`
*   **`AttendanceController`**:
    *   `POST /api/attendance/check-in`

## 4. Implementation Recommendations (for students)
1.  **Lombok**: Use annotations `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` to reduce boilerplate code.
2.  **Passwords**: For simplicity, use a standard hashing algorithm (e.g., via `MessageDigest` or `Commons Codec`), without salt, if the task requires "maximum simplicity".
3.  **Security**: Do not include `spring-boot-starter-security` if you do not want to configure filter chains. Perform checks (if user == null) manually in the service.

This is a basic architecture sufficient to meet the coursework requirements.
