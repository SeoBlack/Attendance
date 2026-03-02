import { pfetch } from "./lib/fetch";

export async function getEnrollments(courseId: number): Promise<Response> {
  return pfetch(`/enrollments?course_id=${encodeURIComponent(courseId)}`, {
    method: 'GET',
  });
}
