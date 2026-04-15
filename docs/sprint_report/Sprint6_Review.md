# Sprint 6 Review Report

**Sprint:** 6  
**Theme (course):** Database / localization — database localization, code review, code clean-up, acceptance test planning, architecture documentation  
**Period:** 02.04.2026 – 16.04.2026.  
**Team:** Soreen Oraibi (SeoBlack), Lev Karavanov (levkaravanov), Olga Shomarova (olshom), Viswak Ggautham (viswak-DataCrunch), Alexey Lebedev (zalman29096)

---

## Sprint goal (course wording)

Extend localization support into the **database layer** while improving overall **code quality** and **maintainability**. This sprint also prepares for project acceptance through **systematic code review**, **refactoring**, and **planning** acceptance tests (execution of acceptance tests is **not** required this sprint).

**Related planning:** [Sprint6_Plan.md](Sprint6_Plan.md)

---

## Course requirements (10 points)

Requirements follow **OTP2/AD (2026) Sprint 6: Database / Localization**.


| Block                                    | Points | Requirement summary                                                                                                                                                                                                                                                       | Deliverables / evidence                                                                                           |
| ---------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **1. Database localization**             | 3      | Design and implement a localization strategy for **database content**; prepare schema and data handling (ERD) for multilingual support; **UTF-8** and locale configuration; validate retrieval and display across supported languages.                                    | Database localization **plan** and **implementation report**; **README** updated with chosen localization method. |
| **2. Statistical code review**           | 3      | Static analysis (e.g. Checkstyle, PMD, SpotBugs, or approved tools). **SonarQube** and **SonarScanner**: detect issues; analyze **cyclomatic complexity**, **LOC per method**, **duplicate/unreachable** code; document findings with **tables, charts, or screenshots**. | **Statistical Code Review Report**: summary metrics, key findings, recommendations, visual evidence.              |
| **3. Code clean-up and refactoring**     | 2      | Refactor from review: smaller functions, remove redundancy, naming/formatting; Java conventions and linting; inline/method comments; **re-run unit tests** — no regressions.                                                                                              | Refactored code on GitHub; **updated unit test results**; **refactoring summary** in this sprint report.          |
| **4. Acceptance test planning**          | 1      | **Plan and design only** (no execution required): acceptance criteria; test cases for functional, usability, performance/reliability; map tests to user stories/requirements.                                                                                             | **Formal Acceptance Test Plan**: criteria, coverage matrix, example test cases with expected outcomes.            |
| **5. Architecture design documentation** | 1      | ER diagrams and UML (or equivalent) design artifacts.                                                                                                                                                                                                                     | ER and UML sketches (**PDF or image**), committed under `**/docs` in the repository.                              |


---

## 1. Database localization (3 points)

**Objectives**

- Localization strategy for content stored in or loaded from the database.
- Schema and data-handling design (including ERD) for multilingual support.
- UTF-8 encoding and locale configuration verified.
- Validation of data retrieval and UI display across supported languages.

**Team outcomes**


| Topic                                                                | Status / notes  | Location in repo                                |
| -------------------------------------------------------------------- | --------------- | ----------------------------------------------- |
| Localization method (e.g. translation tables, JSONB, locale columns) | Completed       | `/docs & readme`                                |
| Migrations / `schema.sql` updates                                    | Completed       | `attendancebackend/src/main/resources/schema.sql` |
| API behavior (`Accept-Language` or explicit locale)                  | Completed       | `Verified`                                        |
| Validation (languages tested)                                        | English, Arabic | `tested`                                          |


---

## 2. Statistical code review (3 points)

**Tools (course)**

- SonarQube and SonarScanner (as specified), and/or Checkstyle, PMD, SpotBugs, etc.

**Metrics to record**

- Cyclomatic complexity
- Lines of code per method
- Duplicate or unreachable code

**Deliverable**

- /docs/SonarQube_report.pdf .

## 3. Code clean-up and refactoring (2 points)

**Tasks**

1. Refactor: split complex functions, remove duplicate logic, consistent naming and formatting.
2. Standards: Java conventions, linting, useful comments where needed.
3. Verification: unit tests re-run; document that there are no regressions.

**Summary for this report (short)**

- *Refactoring summary: REFACTORING_SUMMARY.md*

---

## 4. Acceptance test planning (1 point)

**Scope:** planning and design **only** — do **not** execute full acceptance tests in this sprint if the course only requires the plan.

**Deliverable**

- **Formal Acceptance Test Plan** including:
  - Defined acceptance criteria (from project and sprint requirements).
  - Coverage matrix (requirements ↔ tests).
  - Example test cases: **functional**, **usability**, **performance and reliability**, with expected outcomes.


| Document             | Path                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Acceptance Test Plan | `docs/Sprint6_Acceptance_Test_Plan_Review_Notes.md, docs/sprint_report/Sprint6_Acceptance_Test_Plan.md‎` |


---

## 5. Architecture design documentation (1 point)

**Deliverables**

- ER diagram(s) and UML (or equivalent) sketches.
- Committed under `**/docs` (PDF or image format as required).


| Artifact                       | Format      | Path under `docs/`                |
| ------------------------------ | ----------- | --------------------------------- |
| Updated Class Diagram          | PDF / image | `/diagrams/ClassDiagramV2`          |
| Packages Diagram               | PDF / image | `/diagrams/PackagesDiagram`         |
| ER Diagram for db localization | PDF / image | `/diagrams/ERD for db localization` |


---

---

## Team: contribution, hours, and tasks


| Team Member Name                    | Assigned tasks (summary)     | Time Spent (hrs) |
| ----------------------------------- | ---------------------------- | ---------------- |
| Soreen Oraibi (SeoBlack)[Master]    | implementing db localization | 8h               |
| Lev Karavanov (levkaravanov)        | Acceptance Tests planing     | 2h               |
| Olga Shomarova (olshom)             | Statistical Code analysis    | 4h               |
| Viswak Ggautham (viswak-DataCrunch) | db desgining                 | 1h               |
| Alexey Lebedev (zalman29096)        | code Refactoring             | 3h               |


---

## Short demo / review talking points (Sprint Review)

- Database: how multilingual content is stored and retrieved; UTF-8 / locale.
- Quality: Sonar (or other) highlights before/after; refactoring touchpoints.
- Tests: point to the Acceptance Test Plan and example scenarios.
- Design: walk through ER/UML artifacts in `docs/`.

---
