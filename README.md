# Attendance System

<p>
  <a href="../../actions/workflows/maven.yml">
    <img alt="CI" src="../../actions/workflows/maven.yml/badge.svg" />
  </a>
  <a href="https://java.com">
    <img alt="Java" src="https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white" />
  </a>
  <a href="https://spring.io/projects/spring-boot">
    <img alt="Spring Boot" src="https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F?logo=springboot&logoColor=white" />
  </a>
  <a href="https://maven.apache.org/">
    <img alt="Maven" src="https://img.shields.io/badge/Maven-Build-C71A36?logo=apachemaven&logoColor=white" />
  </a>
</p>

## Product Vision
We are building an application for teachers to replace their google excel sheet when marking their students attendance.

Our vision is to let the teacher focus more on the lectures and less on marking attendance whenever a new student arrives. Also, we want to distribute responsibilities in the class between students and teachers. This will save time and effort for both sides.

## Problem Statement
Teachers are marking their students attendance using excel sheets and by calling their names one by one, which could be time consuming and the teacher might forget to do it sometimes. We are aiming to fix this by making attendance marking one of the students responsibility by creating an application for the students to mark their attendance at each class, reducing time taken for shouting names one by one as well as marking the students who arrive after the names shouting process.

## Key Features
- Teachers can create a lecture with QR or numeric code.
- Students can scan or write the code to mark their attendance.
- Student and teacher accounts must be created and verified.
- Teachers can view statistics of the lecture such as students attended, time interval, and more.
- GPS verification to ensure students are at the campus when marking attendance.

## Current Backend Status (as of 2026-02-06)
Implemented in the backend:
- User signup via `POST /signup`.
- Course endpoints: `GET /courses`, `GET /courses/{id}`, `POST /courses`.
- Entities: `User`, `Course`.
- Auth payload format: JSON (`application/json`).

Planned but not yet implemented:
- Lectures, enrollments, attendance check-in flow.
- Login endpoint and authentication.
- GPS validation and lecture statistics.

## Database Schema
The database schema for the Attendance system is defined in [schema.sql](attendance-backend/src/main/resources/schema.sql).
