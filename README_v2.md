# Attendance System

## Overview

### The problem

Teachers are marking their students attendance using excel sheets and by calling their names one by one, which could be
time consuming.  
Students, who are a bit late may not get marked as present.  
Presence analysis may get complicated depending on the number of students. Any integration to universities digital
system will also have to be done manually.

**Target audience**: Teachers and students  
**Technology stack**:

- `React` SPA front-end
- `SpringBoot` API
- `PostgreSQL` DB.

The project is planned to be implemented to MVP phase within 8 sprints, each sprint - 2 weeks long

**Project started:** 18.01.2026  
**Project completed:** 30.04.2026

---

## Product Vision

We are building an application for teachers to replace their google excel sheet when marking their students attendance.
Our vision is to let the teacher focus more on the lectures and less on marking attendance whenever a new student
arrives.   
This application will allow students to mark their attendance at any time on the lecture which will improve statistics
collection.
Such responsibility delegation will save time and effort for both sides.

**Main features**

- Student and Teacher authentication - easy identification
- Simple course & lecture management for teacher - no mess with hundreds of different Excel files
- Quick attendance marking for student with QR code scanning
- Comprehensive statistics for both parties

Project shall be considered an MVP once both parties will be able to register/sign-in to the system.  
Teachers should be able to manage courses, corresponding lectures and collect presence statistics.
Students should be able to mark their attendance with one button click ( and code scan ) and see participation rate to
specific course.

---

## Implementation plan

The work is organized following Agile methodology.   
Bi-weekly sprints, 8 sprints total.   
Sprint starts on Friday with planning session.   
A week of active development, then 3 days of integration and problem resolution.   
Sprint report is on Thursday 2 weeks from start.  
Intermediate communication handled via Whatsapp.

### Sprint highlights

| N        | Objective                                                                                                                     |
|----------|-------------------------------------------------------------------------------------------------------------------------------|
| Sprint 1 | Plan work ahead, prepare tools, define vision, stack and responsibilities. Prepare initial user stories and organize backlog  |
| Sprint 2 | Prepare required diagrams with comprehensive description of use-cases. Design database. Define testing approach. Prototype UI |
| Sprint 3 | Implement POC backend and frontend. Setup CI/CD.                                                                              |
| Sprint 4 | Extend functionality, add registration/auth/data encapsulation. Containerize all system components.                           |
| Sprint 5 | Localize UI, add support for 4 languages. Continue on backend features                                                        |
| Sprint 6 | Define strategy for data localization, adjust DB schema                                                                       |
| Sprint 7 | Create UATs, run final acceptance tests, fix revealed bugs                                                                    |
| Sprint 8 | Final documentation                                                                                                           |

---

### Sprint 1

[Planning](./docs/sprint_report/Sprint_1_Planning_report.md)   
[Report](./docs/sprint_report/Sprint1_Review.md)


- Defined project scope and vision 
- Established all user-stories for MVP
- Set up task management tools, repository (Github / Github Actions)

---

### Sprint 2

[Planning](./docs/sprint_report/Sprint_2_Planning_report.md)   
[Report](./docs/sprint_report/Sprint2_Review.md)

Functional requirements were established as follows:

- Users must be able to create their accounts
- Users must be able to authenticate into their accounts
- Teacher must be able to create and update / delete courses and lectures within this courses
- Teacher must be able to see a list of students attending specific lecture
- Student must be able to mark lecture attendance by entering lecture code

Use case diagram has been created to reflect these requirements: [Diagram](./docs/diagrams/usecase_diagram.png)

`Postgres` has been selected as DB engine.
Database has been designed and ER diagram created: [ER diagram](./docs/diagrams/Attendance_project_db.png) | [DB schema](./docs/diagrams/Attendance_project_db-Relational%20Schema.png)

--- 

### Sprint 3

[Planning](./docs/sprint_report/Sprint_3_Planning_report.md)   
[Report](./docs/sprint_report/Sprint3_Review.md)

UI mockups have been created and implementation has started.  
[Student lecture view](./docs/design/lecture_view.png)  
[Student dashboard](./docs/design/student_dashboard.png)  
[Teacher dashboard](./docs/design/teacher_dashboard.png)

Technology selection was a `React.js` framework with `MUI` component library.

Initial version of API was implemented with `SpringBoot` java framework.
Jenkins pipeline has been created to automate build and unit testing.  
**Build phase** consisted of `maven` packaging of API artefact and UI bundling with `vite`  
**Test phase** was facilitated by `JUnit` (backend) and `Mocha` (frontend)  
**Coverage phase** implemented with `JaCoCo` (backend only) [Report 1](./docs/sprint_report/images/coverage_report_01.png) | [Report 2](./docs/sprint_report/images/coverage_report_02.png)

---

### Sprint 4

Planning and report missing.

Both front and back end were containerised separately using `Docker`.  
System was deployed locally using `docker compose` to avoid cross-platform problems among developers.  
Database was wrapped in docker from the very beginning of the project using default official image.  

At the same time the system has been enabled with authentication mechanism and tenant-based data segregation

--- 

### Sprint 5
 
[Report](./docs/sprint_report/Sprint5_Review.md)

Fully localized UI introducing support for English, Finnish, Russian and Arabic languages.  
That has been achieved by using 3rd party i18n JS library and fixed set of key->translation pairs.

--- 

### Sprint 6

[Planning](./docs/sprint_report/Sprint6_Plan.md)   
[Report](./docs/sprint_report/Sprint6_Review.md)

Database has been localized. Schema was enriched with language key for appropriate resources (course, user).

---

### Sprint 7

[Planning](./docs/sprint_report/Sprint7_Acceptance_Test_Plan_Template.md)   
[Report](./docs/sprint_report/Sprint7_Review.md)

Fully focused on code and functional quality. For code analysis `SonarQube` was introduced, static analysis performed, [issues gathered and fixed](./docs/sprint_report/images/sonarqube_overview.png)  
For functional testing we used heuristical testing, use-cases have been analyzed and revealed bugs fixed. 


---

### Sprint 8

The related resources have been consolidated in repository, dead-code cleaned, and final documentation produced.


---


# Run it in production mode

```shell

cd attendance-frontend
docker build -t attendance-frontend:latest .

cd ../attendance-backend
docker build -t attendance-backend:latest .

cd ..
# Windows:
$env:PG_LOCAL_DATA="./attendance-backend/data"; docker compose -f compose.yaml up -d postgres

# Linux, Mac:
PG_LOCAL_DATA=/this/is/your/path docker compose -f compose.yaml up -d

```

---

## Run it locally in DEV mode

### Start database

```shell
export PG_LOCAL_DATA=/your/local/path
docker compose -f compose.yaml up -d postgres
```

### Start API

Configure your database connection and app port in `src/main/resources/application.properties`.  
Make sure `src/main/resources/application.properties` matches the DB name, user, and password in `compose.yaml`.  
Then run the app  
```shell
cd attendance-backend/
mvn spring-boot:run
```

### Start UI server


#### Install deps
```shell
cd attendance-frontend/
npm install
```

#### Specify your API url

Copy ``.env.example`` to ``.env.local`` and change the value of ``VITE_API_URL`` to your API url (most likely `http://localhost:8081`)

#### Start

```shell
npm run dev
```

Access at URL provided by `vite` in output 

---

## Test it

### Backend

```shell
cd attendance-backend/
mvn test
```
### Frontend

```shell
cd attendance-frontend/
npm run test
```

--- 

## Repository explained

`attendance-frontend/` - main directory for UI
`attendance-backend/` - main directory for API
`docs/` - documentation and report
`Jenkinsfile` - jenkins pipeline for whole project
`compose.yaml` - Docker compose file to spin up project in production mode

---

## Authors

**Team 6**  
Software Engineering Project 2 TX00EY30-3010

Olga Shomarova
Sorin
Lev Karavanov
Viswak Balakrishnan
Alexei Levedev