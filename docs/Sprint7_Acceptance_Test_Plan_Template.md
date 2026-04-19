# Sprint 7 Acceptance Test Plan (Simple Template)

## Purpose

Validate the main project features with 10 acceptance test cases.  
Each engineer executes all 10 cases individually, then the team combines results.

## Team

- Soreen Oraibi
- Lev Karavanov
- Olga Shomarova
- Viswak Ggautham
- Alexey Lebedev

## Test Environment

| Item     | Value                              |
| -------- | ---------------------------------- |
| Frontend | `attendance-frontend` latest build |
| Backend  | `attendancebackend` latest build   |
| Database | UTF-8 enabled, latest schema       |
| Accounts | 1 teacher + 1 student              |

## Acceptance Test Cases (Baseline)

| ID    | Scenario                                                 | Expected Result                            |
| ----- | -------------------------------------------------------- | ------------------------------------------ |
| TC-01 | Sign in as teacher and student, verify role-based access | Each role sees only allowed pages/actions  |
| TC-02 | Create a course and lecture as teacher                   | Course and lecture are created and visible |
| TC-03 | Mark attendance as student using lecture code            | Attendance is saved successfully           |
| TC-04 | Open attendance pages and verify shown data              | Data is correct and consistent             |
| TC-05 | Create course in English                                 | English translation row is stored          |
| TC-06 | Add same course in Russian                               | Russian version is retrievable             |
| TC-07 | Request course with missing locale                       | System returns default locale content      |
| TC-08 | Save/retrieve Arabic or Cyrillic text                    | Text is preserved correctly (UTF-8)        |
| TC-09 | Teacher uploads student list                             | Students are imported to the course        |
| TC-10 | Teacher adds one student manually                        | Student appears in course enrollment list  |

## Individual Executions

**Soreen Oraibi**

| Field       | Value           |
| ----------- | --------------- |
| Engineer    | `Soreen Oraibi` |
| Date        | `19-04-2026`    |
| Environment | `latest-local`  |

| Test Case | Result (Pass/Fail) | Notes / Defect                                                                                                                                                    |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-01     | PASS               | NONE                                                                                                                                                              |
| TC-02     | PASS               | Creating a lecture with a long time interval will not be prevented, also the lecture remaining time shows weirdly days in minuts.                                 |
| TC-03     | PASS               | When student marks attendance, the teacher has to refresh the page to see the student                                                                             |
| TC-04     | PASS               | data is shown but the refresh needs to be done to load the new data each time students mark attendance                                                            |
| TC-05     | PASS               | NONE                                                                                                                                                              |
| TC-06     | PASS               | NONE                                                                                                                                                              |
| TC-07     | PASS               | when requesting the missing locale it returns the default, but then when requesting an existing locale, it will still serve the default locale untill refreshing. |
| TC-08     | PASS               | None                                                                                                                                                              |
| TC-09     | PASS               | teacher can import students through XML even though the students are not registered in the platform.                                                              |
| TC-10     | PASS               | adding student with the wrong name and correct email will not show error, but will also not add the student.                                                      |

**Lev Karavanov**

| Field       | Value           |
| ----------- | --------------- |
| Engineer    | `Lev Karavanov` |
| Date        | `<YYYY-MM-DD>`  |
| Environment | `<URL/build>`   |

| Test Case | Result (Pass/Fail) | Notes / Defect |
| --------- | ------------------ | -------------- |
| TC-01     |                    |                |
| TC-02     |                    |                |
| TC-03     |                    |                |
| TC-04     |                    |                |
| TC-05     |                    |                |
| TC-06     |                    |                |
| TC-07     |                    |                |
| TC-08     |                    |                |
| TC-09     |                    |                |
| TC-10     |                    |                |

**Olga Shomarova**

| Field       | Value            |
| ----------- | ---------------- |
| Engineer    | `Olga Shomarova` |
| Date        | `<YYYY-MM-DD>`   |
| Environment | `<URL/build>`    |

| Test Case | Result (Pass/Fail) | Notes / Defect |
| --------- | ------------------ | -------------- |
| TC-01     |                    |                |
| TC-02     |                    |                |
| TC-03     |                    |                |
| TC-04     |                    |                |
| TC-05     |                    |                |
| TC-06     |                    |                |
| TC-07     |                    |                |
| TC-08     |                    |                |
| TC-09     |                    |                |
| TC-10     |                    |                |

**Viswak Ggautham**

| Field       | Value             |
| ----------- | ----------------- |
| Engineer    | `Viswak Ggautham` |
| Date        | `<YYYY-MM-DD>`    |
| Environment | `<URL/build>`     |

| Test Case | Result (Pass/Fail) | Notes / Defect |
| --------- | ------------------ | -------------- |
| TC-01     |                    |                |
| TC-02     |                    |                |
| TC-03     |                    |                |
| TC-04     |                    |                |
| TC-05     |                    |                |
| TC-06     |                    |                |
| TC-07     |                    |                |
| TC-08     |                    |                |
| TC-09     |                    |                |
| TC-10     |                    |                |

**Alexey Lebedev**

| Field       | Value            |
| ----------- | ---------------- |
| Engineer    | `Alexey Lebedev` |
| Date        | `<YYYY-MM-DD>`   |
| Environment | `<URL/build>`    |

| Test Case | Result (Pass/Fail) | Notes / Defect |
| --------- | ------------------ | -------------- |
| TC-01     |                    |                |
| TC-02     |                    |                |
| TC-03     |                    |                |
| TC-04     |                    |                |
| TC-05     |                    |                |
| TC-06     |                    |                |
| TC-07     |                    |                |
| TC-08     |                    |                |
| TC-09     |                    |                |
| TC-10     |                    |                |

## Team Consolidated Results

| Test Case | Soreen Oraibi | Lev Karavanov | Olga Shomarova | Viswak Ggautham | Alexey Lebedev |
| --------- | ------------- | ------------- | -------------- | --------------- | -------------- |
| TC-01     |               |               |                |                 |                |
| TC-02     |               |               |                |                 |                |
| TC-03     |               |               |                |                 |                |
| TC-04     |               |               |                |                 |                |
| TC-05     |               |               |                |                 |                |
| TC-06     |               |               |                |                 |                |
| TC-07     |               |               |                |                 |                |
| TC-08     |               |               |                |                 |                |
| TC-09     |               |               |                |                 |                |
| TC-10     |               |               |                |                 |                |

Overall result summary:

- `<Example: 9/10 tests passed for all engineers>`
- `<List open defects and retest status>`
