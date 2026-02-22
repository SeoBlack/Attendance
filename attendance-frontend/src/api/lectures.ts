import { pfetch } from "./lib/fetch";
import type { Lecture } from "../entities/lecture";

export async function createLecture(lecture: Omit<Lecture, 'id' | 'joinCode'>): Promise<Response> {
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
