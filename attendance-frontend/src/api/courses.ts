import { pfetch } from "./lib/fetch";
import type { Course } from "../entities/course";

export async function getCourses(): Promise<Response> {
  return pfetch(`/courses`, {
    method: 'GET',
  });
}

export async function getCourse(id: number): Promise<Response> {
  return pfetch(`/courses/${id}`, {
    method: 'GET',
  });
}

export async function saveCourse(course: Course): Promise<Response> {
  const isUpdate = !!course?.id;
  return pfetch(`/courses`, {
    method: isUpdate ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });
}

export async function deleteCourse(id: number): Promise<Response> {
  return pfetch(`/courses/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadEnrollments(courseId: number, file: File): Promise<Response> {
  const form = new FormData();
  form.append('file', file);
  return pfetch(`/enrollments?course_id=${encodeURIComponent(courseId)}`, {
    method: 'POST',
    body: form,
  });
}
