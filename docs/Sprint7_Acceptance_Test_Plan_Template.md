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
| Item | Value |
|---|---|
| Frontend | `attendance-frontend` latest build |
| Backend | `attendancebackend` latest build |
| Database | UTF-8 enabled, latest schema |
| Accounts | 1 teacher + 1 student |

## Acceptance Test Cases (Baseline)

| ID | Scenario | Expected Result | Pass/Fail | Notes |
|---|---|---|---|---|
| TC-01 | Sign in as teacher and student, verify role-based access | Each role sees only allowed pages/actions |  |  |
| TC-02 | Create a course and lecture as teacher | Course and lecture are created and visible |  |  |
| TC-03 | Mark attendance as student using lecture code | Attendance is saved successfully |  |  |
| TC-04 | Open attendance pages and verify shown data | Data is correct and consistent |  |  |
| TC-05 | Create course in English | English translation row is stored |  |  |
| TC-06 | Add same course in Russian | Russian version is retrievable |  |  |
| TC-07 | Request course with missing locale | System returns default locale content |  |  |
| TC-08 | Save/retrieve Arabic or Cyrillic text | Text is preserved correctly (UTF-8) |  |  |
| TC-09 | Teacher uploads student list | Students are imported to the course |  |  |
| TC-10 | Teacher adds one student manually | Student appears in course enrollment list |  |  |

## Individual Execution Template (copy per engineer)

| Field | Value |
|---|---|
| Engineer | `<Name>` |
| Date | `<YYYY-MM-DD>` |
| Environment | `<URL/build>` |

| Test Case | Result (Pass/Fail) | Notes / Defect |
|---|---|---|
| TC-01 |  |  |
| TC-02 |  |  |
| TC-03 |  |  |
| TC-04 |  |  |
| TC-05 |  |  |
| TC-06 |  |  |
| TC-07 |  |  |
| TC-08 |  |  |
| TC-09 |  |  |
| TC-10 |  |  |

## Team Consolidated Results

| Test Case | Soreen Oraibi | Lev Karavanov | Olga Shomarova | Viswak Ggautham | Alexey Lebedev |
|---|---|---|---|---|---|
| TC-01 |  |  |  |  |  |
| TC-02 |  |  |  |  |  |
| TC-03 |  |  |  |  |  |
| TC-04 |  |  |  |  |  |
| TC-05 |  |  |  |  |  |
| TC-06 |  |  |  |  |  |
| TC-07 |  |  |  |  |  |
| TC-08 |  |  |  |  |  |
| TC-09 |  |  |  |  |  |
| TC-10 |  |  |  |  |  |

Overall result summary:
- `<Example: 9/10 tests passed for all engineers>`
- `<List open defects and retest status>`

