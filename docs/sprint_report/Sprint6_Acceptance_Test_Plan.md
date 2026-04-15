# Sprint 6 Acceptance Test Plan

**Project:** Attendance Marking Platform  
**Sprint:** Sprint 6  
**Team Members:** Soreen Oraibi, Lev Karavanov, Olga Shomarova, Viswak Ggautham, Alexey Lebedev  
**Date:** 15.04.2026  
**Backlog:** [GitHub Project Board](https://github.com/users/SeoBlack/projects/7/views/21)

---

## 1. Purpose

This document defines a simple **acceptance testing plan** for the Attendance project.

The goal is not to test every technical detail. The goal is to define how we would confirm that the **main user-facing functionality** of the project works correctly and that the Sprint 6 localization changes are acceptable.

This is only a **plan** for acceptance testing. The tests do not need to be fully executed in this sprint.

---

## 2. Scope

This plan covers the **whole project at a high level**, because acceptance testing is about checking the final product from the user point of view.

However, it gives **special attention to Sprint 6**, especially:

- database localization of course content;
- language-based content retrieval;
- fallback to default language;
- correct display of localized content in the UI.

### Main project areas included

- login and access for teacher and student;
- course management;
- lecture creation;
- attendance marking by student;
- viewing attendance information;
- student dashboard/history;
- localization of course content.

### Not included

- unit tests;
- testing every endpoint separately;
- deep performance benchmarking;
- detailed low-level technical validation.

---

## 3. Test Environment

The planned acceptance testing environment is:

- frontend and backend running locally;
- PostgreSQL database with the project schema;
- at least one teacher account and one student account;
- demo data for courses, lectures, enrollments, and attendance records.

---

## 4. Main Acceptance Criteria

The project is considered acceptable if:

1. Teacher and student can sign in and access the correct parts of the system.
2. Teacher can create and manage courses and lectures.
3. Student can mark attendance using the lecture code.
4. Attendance information can be viewed correctly in the system.
5. Student can see personal attendance-related information.
6. Course names and descriptions are shown in the correct language when a translation exists.
7. If a translation does not exist, the system falls back to the default language without failing.
8. The system remains usable and responsive for normal local demo use.

---

## 5. Planned Acceptance Test Scenarios

| ID | Feature | Type | Scenario | Expected result |
|---|---|---|---|---|
| AT-01 | Authentication | Functional | Sign in as teacher and as student | Each user can access the correct role-based pages |
| AT-02 | Course management | Functional | Teacher creates a course with name and description | Course is saved successfully and appears in the teacher course list |
| AT-03 | Lecture management | Functional | Teacher creates a lecture for a course | Lecture is saved successfully and can be opened from teacher pages |
| AT-04 | Attendance marking | Functional | Student enters or scans the lecture code | Attendance is marked successfully for the correct lecture |
| AT-05 | Attendance visibility | Functional | Teacher opens course/attendance-related pages after students mark attendance | Teacher can see attendance-related data correctly |
| AT-06 | Student dashboard/history | Functional | Student opens dashboard and attendance history | Student can see personal course/attendance information correctly |
| AT-07 | Localization by requested language | Functional | Request or open course data with another supported locale such as `ru` or `ar` | Localized course name/description are shown in that language if translation exists |
| AT-08 | Localization fallback | Reliability | Open course data with a locale that has no translation | System falls back to default language and does not fail |
| AT-09 | Unsupported locale / invalid input | Reliability | Use unsupported locale or wrong attendance input | System handles the case safely and shows no critical failure |
| AT-10 | Demo performance | Performance | Use the main pages in a normal local demo environment | Pages and requests remain responsive for demo use |

---

## 6. Non-Functional Acceptance Focus

Besides core functionality, the acceptance plan also checks:

- **Usability:** the main flows are understandable and practical for teacher and student users;
- **Reliability:** missing translations, unsupported locales, or wrong inputs do not break the app;
- **Performance:** the app is responsive enough for a local demo and course review.

---

## 7. Sprint 6 Focus

The main Sprint 6-specific acceptance topic is **database localization**.

For this sprint, we especially want to confirm that:

- course content can be stored by locale;
- the backend returns the correct translation;
- the frontend displays localized content correctly;
- fallback to the default locale works as expected.

So, the acceptance test plan covers the **whole project**, but Sprint 6 adds one extra focus area: **localized course content coming from the database**.

---

## 8. Backlog and Requirements Reference

The acceptance scenarios in this plan are based on:

- the main project functionality described in the repository documentation;
- the Sprint 6 course requirements;
- the team backlog maintained in the GitHub project board.

Backlog reference: [https://github.com/users/SeoBlack/projects/7/views/21](https://github.com/users/SeoBlack/projects/7/views/21)

---

## 9. Conclusion

This acceptance test plan is intentionally simple and suitable for a student project.

It does not try to test everything. It focuses on the main user scenarios of the Attendance system and adds Sprint 6 localization checks as part of the final product acceptance.

---

*Prepared for Sprint 6 review on 15.04.2026.*
