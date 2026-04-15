# Sprint 6 Acceptance Test Plan - Review Notes

**Project:** Attendance Marking Platform  
**Team Members:** Soreen Oraibi, Lev Karavanov, Olga Shomarova, Viswak Ggautham, Alexey Lebedev  
**Date:** 15.04.2026  
**Backlog:** [GitHub Project Board](https://github.com/users/SeoBlack/projects/7/views/21)

---

**Purpose:** short and human-readable version for the Sprint 6 oral review.

---

## What this is

This is the **acceptance test plan** for Sprint 6.

It is important to clarify that this document is about **planning the acceptance tests**, not executing them yet. The course requirement says that for this sprint we only need to **design** the acceptance tests and define how the result will be accepted.

---

## Main goal

The main goal is to explain how we would accept the **whole Attendance project** from the user point of view.

At the same time, because this is **Sprint 6**, we give extra attention to **database localization** and check that it works correctly from end to end:

- content is stored in the database by language;
- the backend returns the correct translation;
- the frontend shows that localized content correctly to the user.

In our project, this mainly applies to **course names and descriptions**.

---

## What is in scope

For Sprint 6, the acceptance testing scope is the **whole product at a high level**, especially the main user flows:

- login;
- course management;
- lecture creation;
- attendance marking;
- student dashboard/history;
- viewing attendance data.

In addition, Sprint 6 adds a specific localization focus:

- translation rows in `course_translation`;
- locale resolution from `Accept-Language`;
- fallback to `default_locale` if the requested translation is missing;
- use of `preferred_locale` for student dashboard and history;
- correct display of localized content in teacher and student flows;
- correct UTF-8 handling for English, Russian, and Arabic text.

---

## Main acceptance criteria

We consider Sprint 6 acceptable if:

1. Teacher and student can access the correct parts of the system.
2. Teacher can create courses and lectures.
3. Student can mark attendance successfully.
4. Attendance-related data can be viewed correctly.
5. Student dashboard/history work correctly.
6. One course can store content in more than one language.
7. The API returns the correct translation when the requested locale exists.
8. If the requested locale does not exist, the system falls back safely to the default language.
9. Arabic, Russian, and English text are stored and returned correctly without broken encoding.

---

## Example test scenarios

The plan includes simple acceptance scenarios such as:

1. Sign in as teacher and student and verify role-based access.
2. Create a course and lecture as teacher.
3. Mark attendance as student using the lecture code.
4. Open attendance-related pages and verify that data is shown correctly.
5. Create a course in English and verify that an English translation row is stored.
6. Add the same course in Russian and verify that the Russian version can be retrieved.
7. Request course data with a missing locale and confirm fallback to the default locale.
8. Save and retrieve Arabic or Cyrillic text and verify that UTF-8 works correctly.

---

## Coverage types

The plan covers four areas:

- **Functional:** does localization work correctly?
- **Usability:** is the behavior clear and consistent for the user?
- **Reliability:** do missing or unsupported locales fail safely?
- **Performance:** are localized requests responsive enough for local demo use?

---

## What we would show in review

For the review, we can present:

- the acceptance criteria;
- the planned acceptance test scenarios from the full plan;
- a few example test cases;
- the connection to the actual implementation in:
  - `README.md`
  - `Sprint6_Plan.md`
  - backend locale-handling and translation logic;
  - the team backlog in GitHub.

---

## Short oral summary

You can explain it like this:

> Our Sprint 6 acceptance test plan covers the whole Attendance project at a high level.  
> We are not executing the tests in this sprint, only planning them.  
> We use the main user flows of the system, such as login, course creation, lecture creation, attendance marking, and student attendance views.  
> Because this is Sprint 6, we also add database localization checks: correct language retrieval, fallback behavior, and UTF-8 support for languages like Russian and Arabic.  
> So the document defines what success means for the product and which acceptance scenarios we would use to confirm that Sprint 6 is complete.

---

## Related files

- [Full acceptance plan](Sprint6_Acceptance_Test_Plan.md)
- [Sprint 6 plan](Sprint6_Plan.md)
- [README database localization section](../../README.md)
- [Backlog](https://github.com/users/SeoBlack/projects/7/views/21)
