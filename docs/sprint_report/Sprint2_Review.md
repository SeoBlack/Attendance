# Sprint 2 Review Report

**Sprint:** 2
**Date:** 28.01.2026 – 11.02.2026
**Team:** Soreen Oraibi, Lev Karavanov, Olga Shomarova, Viswak Ggautham, Alexey Lebedev

---

## Sprint Goal

Begin the development phase of the project, implementing core functionality based on the sprint2 planning and design.

---

## Completed Tasks

| ID | Task                                                                          | Status |
|----|-------------------------------------------------------------------------------|------|
| 1  | Design and implement database schema (PostgreSQL + H2 for tests)              | Done |
| 2  | Create the initial setup for the project                                      | Done |
| 3  | Design UI with Figma                                                          | Done |
| 4  | Design common frontend components with mui                                    | Done |
| 5  | Implement backend endpoint `POST /signup` for user registration               | Done |
| 6  | Add reusable password hashing utility                                         | Done |
| 7  | Add JUnit tests for signup edge cases                                         | Done |
| 8  | Implement backend endpoint `POST /signin` for user login                      | Done |
| 9  | Add JUnit tests for signin                                                    | Done |
| 10 | Implement Course entity, repository, service, and controller and tests for them | Done |
| 11 | Create login page                                                             | Done |
| 12 | Implement Lecture entity and CRUD endpoints                                   | Done |
| 13 | Create signup page                                                            | Done |
| 14 | Create rabbit integration                                                     | Done |

---

## Demo Summary

- Demonstrated the **signup and sign in flow**: users can register as TEACHER or STUDENT and log in via REST API endpoints
- Showed **course management backend**: Course entity with repository, service, and controller layers
- Presented the **login page UI** built with reusable frontend components
- Walked through **reusable shared UI components** created for consistent frontend design
- Reviewed **database setup** with PostgreSQL for production and H2 for test environments

---

## What Went Well

- Backend progress: signup, signin, course and lecture management all implemented and merged
- Good test coverage with JUnit tests for backend
- Reusable frontend components established early, setting a solid foundation for future pages
- Multiple PRs reviewed and merged with team code reviews

---

## Test Coverage
- [**Frontend unit tests**](https://users.metropolia.fi/~olgasho/lcov-report/)
- [**Backend JaCoCo report**](https://users.metropolia.fi/~olgasho/jacoco/)

---

## Database schemas

[![DB Diagram]](../diagrams/Attendance_project_db.png)
[![Relational Schema]](../diagrams/Attendance_project_db-Relational%20Schema.png)

---

*Report prepared: 10.02.2026*
