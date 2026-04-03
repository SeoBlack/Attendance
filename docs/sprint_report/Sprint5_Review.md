# Sprint 5 Review Report

**Sprint:** 5  
**Period:** 17.03.2026 – 01.04.2026 (approximate; main localization merges 29.03–01.04.2026)  
**Team:** Soreen Oraibi (SeoBlack), Lev Karavanov (levkaravanov), Olga Shomarova (olshom), Viswak Ggautham (viswak-DataCrunch), Alexey Lebedev (zalman29096)

---

## Sprint goal

**Course wording:** prepare the application for full multilingual support, localize the user interface, and implement GUI localization so it can scale to more languages later.

**Attendance project:** add frontend i18n (English, Russian, Arabic with RTL, **Finnish**); localize student and teacher screens, sign-in and sign-up, move strings into resources, keep date and error messaging consistent; on the backend, support completing registration for users created from enrollments without a password.

---

## Course requirements (10 points)

Requirements follow the OTP2/AD 2026 Sprint 5 (UI localization) theme. Below is how the team addressed them in [SeoBlack/Attendance](https://github.com/SeoBlack/Attendance).

| Block | Points | What we did | Evidence |
|-------|--------|-------------|----------|
| UI preparation for localization | 2 | Static copy moved to JSON bundles; language switcher in the UI; numbers, dates, and table labels use locale where implemented on sprint screens (`Intl`, translation keys). | PRs [#140](https://github.com/SeoBlack/Attendance/pull/140), [#141](https://github.com/SeoBlack/Attendance/pull/141), [#142](https://github.com/SeoBlack/Attendance/pull/142), [#145](https://github.com/SeoBlack/Attendance/pull/145); `attendance-frontend/src/languages/*.json`. |
| Full GUI localization | 5 | At least **two non-Latin scripts**: **Arabic** (RTL) and **Russian** (Cyrillic); English as the default Latin baseline; additionally **Finnish** (Latin). UI updates when the language changes without a full page reload. LTR/RTL handled (theme, RTL plugin, layout tweaks). | [#140](https://github.com/SeoBlack/Attendance/pull/140)–[#142](https://github.com/SeoBlack/Attendance/pull/142), [#145](https://github.com/SeoBlack/Attendance/pull/145). Docs: [README.md](../../README.md), dependencies in [attendance-frontend/package.json](../../attendance-frontend/package.json). |
| Product / Sprint backlog update | 1 | Sprint backlog and localization stories tracked in GitHub with acceptance criteria and estimates. | GitHub Issues and project board (e.g. [#136](https://github.com/SeoBlack/Attendance/issues/136), [#137](https://github.com/SeoBlack/Attendance/issues/137)). |
| GitHub and documentation | 1 | README updated with languages and how to run the UI; localization QA checklist; diagrams under `docs/diagrams/` (see README). | [README.md](../../README.md); [LOCALIZATION_QA_CHECKLIST.md](../LOCALIZATION_QA_CHECKLIST.md); [docs/diagrams/](../diagrams/). |
| Sprint planning and review | 1 | This Sprint 5 report; Sprint 6 plan focused on data localization — [Sprint6_Plan.md](Sprint6_Plan.md). | This file; [Sprint6_Plan.md](Sprint6_Plan.md). |

---

## Internal backlog mapping (Epic 1–6)

| Epic | Scope | Delivery |
|------|-------|----------|
| Epic 1 — localization foundation | i18n library, `en` / `ru` / `ar` / `fi`, selector, persisted language | [#140](https://github.com/SeoBlack/Attendance/pull/140), [#145](https://github.com/SeoBlack/Attendance/pull/145) |
| Epic 2 — Auth | Sign-in, sign-up, localized errors | [#140](https://github.com/SeoBlack/Attendance/pull/140), [#143](https://github.com/SeoBlack/Attendance/pull/143) |
| Epic 3 — Student | Dashboard, attendance history, locale-aware dates | [#141](https://github.com/SeoBlack/Attendance/pull/141) |
| Epic 4 — Teacher | Menu, courses, enrollments, lectures; signup for placeholder users | [#142](https://github.com/SeoBlack/Attendance/pull/142) |
| Epic 5 — RTL / QA | Arabic RTL, layout resilience; QA checklist | [#140](https://github.com/SeoBlack/Attendance/pull/140), [#142](https://github.com/SeoBlack/Attendance/pull/142); [LOCALIZATION_QA_CHECKLIST.md](../LOCALIZATION_QA_CHECKLIST.md) |
| Epic 6 — Documentation | README, sprint report, Sprint 6 plan | README, this report, [Sprint6_Plan.md](Sprint6_Plan.md) |

---

## Team: contribution, hours, and PRs

Summary of each member’s main contribution, primary PR, and **approximate hours** on Sprint 5 work.

| Team Member Name | Assigned tasks (summary) | PR | Time Spent (hrs) |
|------------------|--------------------------|-----|------------------|
| Soreen Oraibi (SeoBlack) | i18n, RTL, theme (`AppThemeProvider`), sign-in/sign-up, menu, fonts | [#140](https://github.com/SeoBlack/Attendance/pull/140) | 4 |
| Lev Karavanov (levkaravanov) | Teacher UI, `PrivateLayout`, dialogs; backend signup for placeholders; merge conflict resolution | [#142](https://github.com/SeoBlack/Attendance/pull/142) | 6 |
| Olga Shomarova (olshom) | Student dashboard and history; dates/times per locale | [#141](https://github.com/SeoBlack/Attendance/pull/141) | 1 |
| Viswak Ggautham (viswak-DataCrunch) | Sign-in/sign-up errors by HTTP status → i18n keys | [#143](https://github.com/SeoBlack/Attendance/pull/143) | 1 |
| Alexey Lebedev (zalman29096) | Finnish: `fi.json`, selector, `i18n.js` | [#145](https://github.com/SeoBlack/Attendance/pull/145) | 1 |

---

## Short demo (Sprint Review)

- Switch `en` / `ru` / `ar` / `fi` without reload; for `ar`, RTL and readable forms.
- Student: dashboard and history with locale-aware dates.
- Teacher: courses, enrollments, lectures, and lecture dashboard in the selected language.
- Sign-in and sign-up errors in the UI language.
- Flow: user from XML enrollments without a password completes sign-up and signs in (see [#142](https://github.com/SeoBlack/Attendance/pull/142)).

---

## Progress, challenges

**Progress:** student/teacher and auth localization merged to `main`; two non-Latin scripts (Arabic, Russian) per course requirements; **Finnish** added ([#145](https://github.com/SeoBlack/Attendance/pull/145)).

**Challenges:** overlapping branches and JSON translation conflicts during parallel work; aligning string length and RTL on shared MUI components.

---

*Report prepared: 01.04.2026*
