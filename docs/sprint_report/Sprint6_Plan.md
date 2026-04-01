# Sprint 6 plan (draft)

**Course focus:** database and model data localization — groundwork for multilingual **content** (not only UI strings in JSON).

**Duration:** to be confirmed by the team (two weeks is suggested, similar to Sprint 5).

---

## Sprint goal

Design and begin implementing support for multilingual **content** stored in the database (e.g. course titles, descriptions, user-visible messages), aligned with the existing PostgreSQL schema and Spring Boot API.

---

## Proposed work streams

| # | Task | Owner (TBD) | Estimate (TBD) |
|---|------|-------------|----------------|
| 1 | Analysis: which entities need translation (courses, lectures, notifications, etc.) | TBD | TBD |
| 2 | Schema options: separate translation tables (`entity_id`, `locale`, `text`) vs JSONB columns; selection criteria | TBD | TBD |
| 3 | Database migrations and `schema.sql` update | TBD | TBD |
| 4 | API: return data respecting `Accept-Language` or an explicit locale parameter | TBD | TBD |
| 5 | Frontend: consume localized fields from the API instead of static keys wherever content comes from the DB | TBD | TBD |
| 6 | Tests and regression of existing flows | TBD | TBD |

---

## Acceptance criteria (draft)

- Target data model for multilingual content is documented (ADR or a section under `docs/`).
- A minimal vertical slice is delivered: one entity with translations end-to-end (DB → API → UI).
- README is updated if run instructions or environment variables change.

---

*Draft Sprint 6 plan for the course requirement (Sprint 5 follow-up: database localization planning). Owners and estimates to be filled in during team planning.*
