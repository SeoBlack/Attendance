import { pfetch } from "./lib/fetch";

export type CreateLectureRequest = {
  courseId: number;
  description: string;
  startDate: number;
  endDate: number;
};

export async function createLecture(lecture: CreateLectureRequest): Promise<Response> {
  return pfetch(`/lectures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lecture),
  });
}

export async function getLectures(courseId?: number): Promise<Response> {
  const query = courseId != null ? `?courseId=${courseId}` : '';
  return pfetch(`/lectures${query}`, {
    method: 'GET',
  });
}

export async function getLecture(id: number): Promise<Response> {
  return pfetch(`/lectures/${id}`, {
    method: 'GET',
  });
}

export async function deleteLecture(id: number): Promise<Response> {
  return pfetch(`/lectures/${id}`, {
    method: 'DELETE',
  });
}
