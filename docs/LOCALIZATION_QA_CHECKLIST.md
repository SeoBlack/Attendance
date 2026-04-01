# Localization QA checklist

This document supports **Epic 5** (*RTL/LTR and formatting QA*) in the Sprint 5 scope — *«A localization QA checklist is documented»* (see [Sprint 5 review](sprint_report/Sprint5_Review.md)).

**Locales in scope:** `en`, `ru`, `ar`, `fi` (Arabic is RTL; others are LTR).

Use this list before a release or Sprint Review.

**GitHub:** task lists use `- [ ]` / `- [x]` **outside tables** so the web UI can show clickable checkboxes on Issues/PRs; for this file, use the **checkbox UI** when editing on GitHub, or toggle `[ ]` → `[x]` in the raw editor.

---

## Global behavior

**1. Language can be changed without full page reload**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**2. Selected language persists after browser refresh (`localStorage`)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**3. No obvious untranslated English leaks (spot-check main screens)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**4. Document / `<html>` direction (`rtl` for `ar`, `ltr` for `en`, `ru`, `fi`)**
- [ ] `en` — `dir=ltr`
- [ ] `ru` — `dir=ltr`
- [ ] `ar` — `dir=rtl`
- [ ] `fi` — `dir=ltr`

---

## Auth (public)

**5. Login page: labels, buttons, links**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**6. Signup page: validation helpers, role labels**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**7. Error messages after failed sign-in / sign-up match locale (not raw API English)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

---

## Student UI

**8. Dashboard: titles, empty states, action labels**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**9. Attendance history: table headers, status chips**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**10. Dates and times use locale-aware formatting (`Intl` / resolved locale)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**11. Status labels (e.g. present / upcoming) are not hardcoded English**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

---

## Teacher UI

**12. Menu and nested header titles for teacher routes**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**13. Courses list / create or edit course**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**14. Enrollments (upload/delete, confirmations)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**15. Lectures list and lecture dashboard (incl. timers, placeholders)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

**16. Long strings: buttons and tables do not break layout (stress `ru`, `ar`; spot-check `fi`)**
- [ ] `en`
- [ ] `ru`
- [ ] `ar`
- [ ] `fi`

---

## RTL-specific (`ar` only)

**17. Navigation drawer / app bar alignment feels correct**
- [ ] `ar`

**18. Forms and tables remain readable; directional icons (e.g. back) behave sensibly**
- [ ] `ar`

**19. No overlapping text in dialogs and snackbars**
- [ ] `ar`

---

## Regression log (optional)

| Date | Locale | Screen | Issue | Fixed (Y/N) |
|------|--------|--------|-------|---------------|
| | | | | |

---

*Last updated: Sprint 5 — aligns with `attendance-frontend/src/languages/*.json` and [README.md](../README.md) localization section.*
