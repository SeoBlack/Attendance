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

## Current Status (as of 2026-03-10)

### Critical functionality completed:

- Authentication and authorization.
- Courses management
- Enrollments management
- Lectures management
- Attendance registration and view (teacher side)

### Planned but not yet implemented:

- Student can see own attendance statistics & history
- GPS validation and lecture statistics (for teachers).
- Teacher can manipulate attendance records.

## UI languages & localization

The frontend supports **English**, **Russian**, **Arabic** (with **RTL** layout for Arabic), and **Finnish**. Translations live in JSON bundles under `attendance-frontend/src/languages/` (`en.json`, `ru.json`, `ar.json`, `fi.json`); Finnish was added in [#145](https://github.com/SeoBlack/Attendance/pull/145).

**Stack:** [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/). RTL uses MUI `direction`, Emotion cache, and `stylis-plugin-rtl` (see `AppThemeProvider`).

**Switching language:** use the in-app language menu. The choice is stored in `localStorage` under key `language` (`en` | `ru` | `ar` | `fi`) so it survives refresh.

**Running the localized UI:** configure and start the frontend as in [attendance-frontend/README.md](attendance-frontend/README.md) (`npm install`, `.env.local` with `VITE_API_URL`, then `npm run dev`). The same build serves all locales.

**Limitations:** only strings from the JSON resources are translated. User- and API-supplied text (e.g. course titles) is shown as stored until **database content localization** ([docs/sprint_report/Sprint6_Plan.md](docs/sprint_report/Sprint6_Plan.md)).

**Resources for translators:** keep keys identical across locale files; edit `*.json` per language.

**QA:** before release or demo, use the [localization QA checklist](docs/LOCALIZATION_QA_CHECKLIST.md) (Epic 5, Sprint 5).

# Technologies used

## Backend

- Java 17
- Spring Boot 4.x
- PostgreSQL 17.x
- Docker
- Docker Compose

## Frontend

- React 19
- Typescript 5.x
- Tailwind CSS 3.x
- Vite 7.x

# Use-case diagram

![Use-case diagram](docs/diagrams/usecase_diagram.png)

# ER diagram

![ER diagram](docs/diagrams/Attendance_project_db.png)

# Database Schema

The database schema for the Attendance system is defined in [schema.sql](attendance-backend/src/main/resources/schema.sql).
![DB schema](docs/diagrams/Attendance_project_db-Relational%20Schema.png)

## Database localization

This section describes the **localization strategy** for the project: what lives in the database versus the frontend, how multilingual **content** is modeled, and encoding/locale expectations.

### Two layers

| Layer              | Responsibility                                                                    | Mechanism                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **User interface** | Buttons, labels, navigation, validation messages bundled with the app             | **i18next** with JSON resources under `attendance-frontend/src/languages/` (e.g. `en`, `ar`, `ru`). Not stored in the database. |
| **Domain text**    | Names and descriptions that belong to business entities (courses, lectures, etc.) | Stored in the database using the patterns below when multilingual support is required for that field.                           |

Static UI strings should stay in JSON so releases stay simple. Database localization applies to **user- or admin-authored** text that must vary by language without redeploying the client.

### Multilingual content: translation table

For entities that need the **same logical field** in more than one language (for example course title and description):

- Keep a **main row** per entity (e.g. `courses`) for language-neutral data: identifiers, foreign keys, timestamps, numeric fields.
- Add a **translation table** with one row per **(entity, locale)** for translatable columns, for example `course_translation(course_id, locale, course_name, description)` with a unique constraint on `(course_id, locale)`.

**Locale** values should follow BCP 47 style codes the product supports (e.g. `en`, `ar`, `ru`), aligned with the frontend language codes.

**Entry workflow:** require **one** default language at create time (the teacher’s current UI language or an application default). Additional locales are **optional** and can be added later. When serving data, if a translation is missing for the requested locale, **fall back** to the default locale (then optionally to any available string). Teachers do not need to type every supported language on every save.

### User locale preference (optional)

**`preferred_locale` on `users`** can store the student’s preferred language for localized API responses. It does **not** replace translation rows for multilingual course titles; those live in `course_translation`.

### Character encoding and locale

- **PostgreSQL:** Use **UTF-8** for the database encoding so all supported scripts (Latin, Arabic, Cyrillic, etc.) store and compare correctly. Modern PostgreSQL defaults are typically UTF-8; confirm with `\l` in `psql` or your host configuration.
- **Application / JDBC:** Ensure the connection uses UTF-8 (driver defaults are usually correct; document any explicit `characterEncoding` or PostgreSQL `client_encoding` if you set them).
- **Sorting and searching:** If you order or search on translated text per locale, document **collation** choices (PostgreSQL locale or column-level collation) in the implementation report; otherwise default database collation may suffice for MVP.

### Validation and display

- **API:** Accept a locale via `Accept-Language`, a query parameter, or the authenticated user’s preference; resolve translated fields using **requested locale → fallback chain → default locale**.
- **Frontend:** Continue using **i18next** for chrome; display API-returned names/descriptions as returned for the active locale.
- **Tests:** Cover at least one entity with two locales and one missing translation to assert fallback behavior and correct UTF-8 round-trip.

### Connecting database localization to the frontend

The backend picks the translation row using the **requested locale**. The frontend should send that locale on every authenticated API call and render the strings the API returns as plain text (do not run them through `t()`).

1. **Send `Accept-Language` with the active UI language**  
   The shared HTTP helper [`attendance-frontend/src/api/lib/fetch.ts`](attendance-frontend/src/api/lib/fetch.ts) adds an `Accept-Language` header derived from **i18next** (`i18n.language`, primary subtag only, e.g. `en` from `en-US`). That must match the locale keys stored for courses (`en`, `ar`, `ru`) so `GET /courses`, `GET /courses/{id}`, `GET /student/dashboard`, and `GET /student/history` return `courseName` / descriptions in the user’s language when a translation exists.

2. **Keep i18next and API responsibilities separate**
   - **JSON files** under `attendance-frontend/src/languages/`: labels, buttons, menu (`t('...')`).
   - **API JSON fields** (e.g. `courseName`, `description` on course objects): show as `{course.courseName}` without `t()`, because they already come localized from the server.

3. **Student preference vs browser language**  
   If `users.preferred_locale` is set in the database, the student dashboard/history services resolve the course title using that value before `Accept-Language`. To drive that from the app later, add a profile setting that PATCHes the user and persist `preferred_locale`.

4. **Teacher create/update course**  
   `POST` / `PUT /courses` sends `courseName`, `description`, and optionally `defaultLocale`. The text is stored for `defaultLocale` (defaults from `Accept-Language` if omitted). Align `defaultLocale` with the teacher’s UI when saving (e.g. same primary subtag as `i18n.language`) so the correct translation row is updated.

After changing language in the **LanguageSelector**, i18next updates `i18n.language`; the next `pfetch` calls send the new `Accept-Language`, so list and detail views refetched from the API reflect the new locale without extra wiring in each page.

# Design samples

[Figma link](https://www.figma.com/design/sZLcbQrxw2GWL2JwaMqEaD/Untitled?node-id=3-4&t=LgzHsbRGwN9KeBQI-0)

## Lecture view

![Lecture view](docs/design/lecture_view.png)

## Student dashboard

![Student dashboard](docs/design/student_dashboard.png)

## Teacher dashboard

![Teacher dashboard](docs/design/teacher_dashboard.png)

---

# Run localy

## 0. Database

```shell
PG_LOCAL_DATA=PATH_TO_DATA_DIR docker compose -f compose.yaml up -d postgres
```

## 1. Backend

Check backend readme for reference

## 2. Frontend

Check frontend readme for reference

---

# Build and run Docker

```shell
cd attendance-frontend
docker build -t attendance-frontend:latest .

cd ../attendance-backend
docker build -t attendance-backend:latest .

cd ..
Windows:
$env:PG_LOCAL_DATA="./attendance-backend/data"; docker compose -f compose.yaml up -d postgres

Linux, Mac:
PG_LOCAL_DATA=/this/is/your/path docker compose -f compose.yaml up -d

```

---

[TEACHER JOURNEY MAP in Figma](https://www.figma.com/board/3dinfOaquf2pNITHZnsUPz/User-Journey-Map?node-id=6-243&t=X15jp82Z1kkL7F8O-1)
