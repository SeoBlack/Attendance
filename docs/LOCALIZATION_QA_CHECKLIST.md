# Localization QA checklist

This document supports **Epic 5** (*RTL/LTR and formatting QA*) in the Sprint 5 scope — *«A localization QA checklist is documented»* (see [Sprint 5 review](sprint_report/Sprint5_Review.md)).

**Locales in scope:** `en`, `ru`, `ar`, `fi` (Arabic is RTL; others are LTR).

Use this list before a release or Sprint Review. In the GitHub **web editor**, you can toggle items by changing `- [ ]` to `- [x]` (or use the checkbox UI where GitHub shows it for task lists).

---

## Global behavior

| # | Check | en | ru | ar | fi |
|---|--------|----|----|----|----|
| 1 | Language can be changed **without full page reload** | - [ ] | - [ ] | - [ ] | - [ ] |
| 2 | Selected language **persists** after browser refresh (`localStorage`) | - [ ] | - [ ] | - [ ] | - [ ] |
| 3 | **No obvious untranslated** English leaks on that locale (spot-check main screens) | - [ ] | - [ ] | - [ ] | - [ ] |
| 4 | **Document / `<html>` direction:** `rtl` for `ar`, `ltr` for `en`, `ru`, `fi` | n/a | n/a | - [ ] | n/a |

---

## Auth (public)

| # | Check | en | ru | ar | fi |
|---|--------|----|----|----|----|
| 5 | Login page: labels, buttons, links | - [ ] | - [ ] | - [ ] | - [ ] |
| 6 | Signup page: validation helpers, role labels | - [ ] | - [ ] | - [ ] | - [ ] |
| 7 | **Error messages** after failed sign-in / sign-up match locale (not raw API English) | - [ ] | - [ ] | - [ ] | - [ ] |

---

## Student UI

| # | Check | en | ru | ar | fi |
|---|--------|----|----|----|----|
| 8 | Dashboard: titles, empty states, action labels | - [ ] | - [ ] | - [ ] | - [ ] |
| 9 | Attendance history: table headers, status chips | - [ ] | - [ ] | - [ ] | - [ ] |
| 10 | **Dates and times** use locale-aware formatting (`Intl` / resolved locale) | - [ ] | - [ ] | - [ ] | - [ ] |
| 11 | Status labels (e.g. present / upcoming) are **not hardcoded English** | - [ ] | - [ ] | - [ ] | - [ ] |

---

## Teacher UI

| # | Check | en | ru | ar | fi |
|---|--------|----|----|----|----|
| 12 | Menu and nested **header titles** for teacher routes | - [ ] | - [ ] | - [ ] | - [ ] |
| 13 | Courses list / create or edit course | - [ ] | - [ ] | - [ ] | - [ ] |
| 14 | Enrollments (upload/delete, confirmations) | - [ ] | - [ ] | - [ ] | - [ ] |
| 15 | Lectures list and lecture dashboard (incl. timers, placeholders) | - [ ] | - [ ] | - [ ] | - [ ] |
| 16 | **Long strings:** buttons and tables do not break layout (`ru`, `ar`; spot-check `fi`) | - [ ] | - [ ] | - [ ] | - [ ] |

---

## RTL-specific (`ar` only)

| # | Check | ar |
|---|--------|-----|
| 17 | Navigation drawer / app bar alignment feels correct | - [ ] |
| 18 | Forms and tables remain readable; icons that imply direction (e.g. back) behave sensibly | - [ ] |
| 19 | No overlapping text in dialogs and snackbars | - [ ] |

---

## Regression log (optional)

| Date | Locale | Screen | Issue | Fixed (Y/N) |
|------|--------|--------|-------|---------------|
| | | | | |

---

*Last updated: Sprint 5 — aligns with `attendance-frontend/src/languages/*.json` and [README.md](../README.md) localization section.*
