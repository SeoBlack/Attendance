import { pfetch } from "./lib/fetch";

export async function getEnrollments(courseId: number): Promise<Response> {
  return pfetch(`/enrollments?course_id=${encodeURIComponent(courseId)}`, {
    method: 'GET',
  });
}

export async function deleteEnrollment(courseId: number, userId: number): Promise<Response> {
  return pfetch(`/enrollments/${encodeURIComponent(courseId)}?user_id=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}
