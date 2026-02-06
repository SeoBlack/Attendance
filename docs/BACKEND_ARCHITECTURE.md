# Backend Architecture for "Attendance" Project

This document describes the structure and components of the backend attendance tracking system. The project is developed as an educational assignment, focusing on simplicity of implementation and understanding.

## Current Implementation Status (as of 2026-02-06)
The backend currently implements user signup and basic course CRUD. The architecture below reflects what exists in code today, and separates planned components that are not yet implemented.

## 1. Technology Stack and Principles
*   **Language**: Java 17+
*   **Framework**: Spring Boot 4.0.2 (WebMVC, Data JPA)
*   **Database**: PostgreSQL (runtime via Docker) and H2 (tests)
*   **Build Tool**: Maven
*   **Security**: BCrypt hashing via `spring-security-crypto` (no Spring Security filter chain).

## 2. Package Structure
Root Package: `org.example.attendancebackend`

```text
src/main/java/org/example/attendancebackend/
├── controller/          # REST Controllers (Endpoints)
├── dto/                 # Data Transfer Objects (Request/Response)
├── entity/              # JPA Entities (correspond to DB tables)
├── repository/          # Data Access Interfaces (Spring Data JPA)
├── service/             # Business Logic
└── util/                # Utilities (password hashing)
```

## 3. System Components

### 3.1. Entities
Classes in the `entity` package currently implemented:

*   **`User`** (`users`):
    *   Fields: `id` (user_id), `role`, `firstName`, `lastName`, `email`, `passwordHash`.
*   **`Course`** (`courses`):
    *   Fields: `id` (course_id), `courseName`, `description`.

Tables defined but not yet mapped in code (present in `schema.sql`):
*   `lectures`
*   `enrollments`
*   `attendance`

### 3.2. Repositories
Interfaces in the `repository` package, extending `JpaRepository<Entity, Long>`:

*   `UserRepository`: method `boolean existsByEmail(String email);`
*   `CourseRepository`

### 3.3. DTO (Data Transfer Objects)
Package `dto` for API cleanliness.

*   `SignupRequest`: `firstName`, `lastName`, `role`, `email`, `password`.
*   `SigninRequest`: `email`, `password`.

### 3.4. Services
Package `service`.

*   **`UserService`**:
    *   `signup(SignupRequest req)`: Validates input, checks duplicate email, hashes password with BCrypt, saves `User`.

### 3.5. Controllers
Package `controller`, REST API.

*   **`AuthController`**:
    *   `POST /signup`
*   **`CourseController`**:
    *   `GET /courses`
    *   `GET /courses/{id}`
    *   `POST /courses`

## 4. Planned Components (Not Implemented Yet)
*   Entities and repositories for `Lecture`, `Enrollment`, `Attendance`.
*   Attendance flow: `POST /api/attendance/check-in`.
*   Login endpoint and session/auth mechanism.
*   `POST /signin` with `application/json` request body (`email`, `password`).
*   API prefixing under `/api/*` and structured DTO responses.
*   GPS validation and lecture statistics.

## 5. Implementation Recommendations (for students)
1.  **Lombok**: Use annotations `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` to reduce boilerplate code.
2.  **Passwords**: BCrypt is already in use; keep it consistent for signup and login.
3.  **Security**: No filter chain is configured; add Spring Security only when you are ready to design authentication/authorization flows.

This is a basic architecture sufficient to meet the coursework requirements.
