# Team 6 - Sprint 2 Planning Report

**Project:** Attendance Marking Platform
**Team Members:** Soreen Oraibi, Lev Karavanov, Olga Shomarova, Viswak Ggautham, Alexey Lebedev

## Sprint Number & Dates

**Sprint Number:** Sprint 2
**Sprint Duration:** 2 Weeks (28 Jan 2026 – 11 Feb 2026)

## Sprint Goal

The goal of Sprint 2 is to begin the development phase of the project, implementing core functionality based on the planning and design completed in Sprint 1.

## Selected Product Backlog Items

The following is a part of product backlog. Full product backlog is accessible through [this link](https://github.com/users/SeoBlack/projects/7/views/18).

- [**Teacher can sign up**](https://github.com/SeoBlack/Attendance/issues/3)
- [**Teacher can create a course**](https://github.com/SeoBlack/Attendance/issues/55)
- [**Teacher can create a lecture**](https://github.com/SeoBlack/Attendance/issues/4)
- [**Student can sign up**](https://github.com/SeoBlack/Attendance/issues/11)
- [**Student can log in**](https://github.com/SeoBlack/Attendance/issues/12)
## Planned Tasks / Breakdown

- Design Database Schema
- Implement designed Database
- Test implemented Database
- Implement backend endpoint `POST /signup` for user registration
- Support signup for both `TEACHER` and `STUDENT` roles
- Accept signup JSON payload fields: `firstName`, `lastName`, `role`, `email`, `password`
- Add reusable password hashing utility (hash + verify) for signup/login flow
- Return HTTP statuses for signup: `201 Created` on success, `500` on server error
- Add JUnit tests for signup edge cases:
- user already exists
- empty first/last name
- Implement Course entity, repository, service, and controller
- Add validation for course creation
- Add JUnit tests for Course repository, service, and controller
- Implement Lecture entity, repository, service, and controller
- Implement lecture CRUD endpoints (create, read, update, delete)
- Add JUnit tests for Lecture controller
- Create common/shared frontend UI components
- Create login page
- Create signup page

## Team Capacity & Assumptions

For Sprint 2, the team members agreed to:

- Meetings are conducted via **Zoom**
- Working hours are recorded individually in a [**shared Excel file**](https://docs.google.com/spreadsheets/d/1dspZzyTKZQ3gSfYgfqsvOHN0jlBift1EQsPgZXc2vzM/edit?usp=sharing)
- After completing an individual task, request a code review from 2 team members so that the team stays informed about the implemented features and the chosen implementation approaches.

## Definition of Done

A Sprint 2 task is considered done when:

- The task objectives are completed and reviewed by the team.
- The task is moved to the "Done" column in GitHub project.
- Relevant documentation is available in the project repository.
- Selected Product Backlogs have at least begun to be developed.
