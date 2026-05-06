# Attendance System

## 1. Project Title & Overview

Attendance System - a web application that replaces manual, spreadsheet-based attendance tracking. 
It lets teachers create lectures with QR/numeric codes and students mark presence themselves, reducing in-class overhead and improving data accuracy and visibility.

- Target users: Teachers and students
- Tech stack: React (Vite, TS), Spring Boot (Java 17), PostgreSQL, Docker
- Duration: 8 sprints * 2 weeks (18.01.2026 -> 30.04.2026)

## 2. Product Vision

Enable teachers to focus on teaching while students self-mark attendance. 
The system simplifies course/lecture management and provides clear statistics.

- Goals: simplified attendance registration, simple management, reliable stats
- Key features: authentication, courses/lectures, QR/code check-in, attendance stats, localization
- MVP: 
  - both roles can register/sign in
  - teachers manage courses/lectures and view stats
  - students mark attendance and view participation rate

## 3. Project Plan & Sprint Structure

Agile with bi-weekly sprints. Planning on Friday, then a week of development. 
3 days integration/fixes, review on Thursday. Communication via WhatsApp.

Sprint goals overview:
- S1: Vision, scope, tools, initial backlog
- S2: Requirements, diagrams, DB design, test approach
- S3: POC UI/API, CI/CD
- S4: Feature growth, auth/tenant isolation, containerization
- S5: UI localization (4 languages)
- S6: Database localization strategy/schema
- S7: UAT and quality improvements
- S8: Final documentation

---

## Sprint 1 – Project Planning & Vision

- Project plan and vision defined, MVP scope agreed
- Backlog created with user stories for teacher/student
- Tooling set up (GitHub, CI, task manager)
- [Planning](docs/sprint_report/Sprint_1_Planning_report.md) | [Review](docs/sprint_report/Sprint1_Review.md)

##  Sprint 2 – Requirements & Database

- Functional requirements finalized (accounts, auth, course/lecture CRUD, attendance via code, teacher view)
- Use Case Diagram: [Use Case Diagram](docs/diagrams/usecase_diagram.png)
- [ER Diagram](docs/diagrams/Attendance_project_db.png) | [Relational schema](docs/diagrams/Attendance_project_db-Relational%20Schema.png)
- Database: PostgreSQL, initial schema prepared

[Planning](docs/sprint_report/Sprint_2_Planning_report.md) | [Review](docs/sprint_report/Sprint2_Review.md)

##  Sprint 3 – UI Implementation & CI

- UI: React with MUI, key screens prototyped:
  - Prototypes: [Lecture view](docs/design/lecture_view.png) | [Student dashboard](docs/design/student_dashboard.png) | [Teacher dashboard](docs/design/teacher_dashboard.png)
- CI/CD: Jenkins pipeline
  - Build: Maven (backend), Vite (frontend)
  - Test: JUnit (backend), Mocha (frontend)
  - Coverage: JaCoCo (backend): [Coverage report 1](docs/sprint_report/images/coverage_report_01.png), [Coverage report 2](docs/sprint_report/images/coverage_report_02.png)

[Planning](docs/sprint_report/Sprint_3_Planning_report.md) | [Review](docs/sprint_report/Sprint3_Review.md)

##  Sprint 4 – Docker Containerization

- Purpose: consistent dev env
- Services containerized: frontend, backend, PostgreSQL
- Every service has its own Docker file

(Planning/report: have not been prepared)

##  Sprint 5 – UI Localization & Kubernetes

- UI localized
- Supported languages: English, Russian, Arabic (RTL), Finnish
- Approach: i18next/react-i18next with JSON bundles in attendance-frontend/src/languages/, RTL via MUI direction + Emotion RTL plugin
- Language choice stored in localStorage, single build serves all locales
- Kubernetes: not implemented

[Review](docs/sprint_report/Sprint5_Review.md)

##  Sprint 6 – Database Localization

- Strategy: separate translation tables per entity, one row per (entity, locale), default locale required, fallbacks supported
- Schema: [Updated to facilitated localized data](docs/diagrams/ERD%20for%20db%20localization.png). Course/user text fields localized via translation tables

[Planning](docs/sprint_report/Sprint6_Plan.md) | [Review](docs/sprint_report/Sprint6_Review.md)

## Sprint 7 – Quality Assurance

- Static analysis using SonarQube. Key issues captured and fixed: [SonarQube overview](docs/sprint_report/images/sonarqube_overview.png)
- Functional testing: heuristic/use-case driven, acceptance tests prepared and run
- Performance testing: not implemented

[Planning](docs/sprint_report/Sprint7_Acceptance_Test_Plan_Template.md) | [Review](docs/sprint_report/Sprint7_Review.md)

##  Sprint 8 – Documentation & Finalization

- Consolidated docs and diagrams, cleaned dead code
- Finalized README

---

## 4. How to Run the Project

Prerequisites:
- Docker and Docker Compose | Node.js 20+ | Java 17 | Maven | PostgreSQL via Docker

Production-like (containers):
```sh
cd attendance-frontend && docker build -t attendance-frontend:latest .
cd ../attendance-backend && docker build -t attendance-backend:latest .
cd ..
# Windows PowerShell
$env:PG_LOCAL_DATA="./attendance-backend/data"; docker compose -f compose.yaml up -d postgres
# Linux/Mac
PG_LOCAL_DATA=/this/is/your/path docker compose -f compose.yaml up -d
```

Local DEV:
1) Start DB
```sh
export PG_LOCAL_DATA=/your/local/path
docker compose -f compose.yaml up -d postgres
```
2) Start API
```sh
cd attendance-backend
# Ensure src/main/resources/application.properties matches compose.yaml creds
mvn spring-boot:run
```
3) Start UI
```sh
cd attendance-frontend
npm install
cp .env.example .env.local  # set VITE_API_URL, e.g. http://localhost:8081
npm run dev
```
Access UI at the Vite dev server URL.

## 5. Testing Instructions

- Backend unit tests:
```sh
cd attendance-backend && mvn test
```
- Frontend tests:
```sh
cd attendance-frontend && npm run test
```
- Coverage: JaCoCo reports for backend (see Sprint 3 links)
- Performance testing: not applied

## 6. Repository Structure

- `attendance-frontend/` User interface
- `attendance-backend/` API
- `docs/` - diagrams, sprint reports, images
- `Jenkinsfile` - CI/CD pipeline
- `compose.yaml` - Docker Compose orchestration

## 7. Authors

Team 6 - Software Engineering Project 2 TX00EY30-3010
- Olga Shomarova
- Soreen Oraibi
- Lev Karavanov
- Viswak Balakrishnan
- Alexei Levedev

Dates: 18.01.2026 - 30.04.2026
