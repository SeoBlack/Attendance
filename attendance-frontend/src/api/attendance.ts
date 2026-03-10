import { pfetch } from "./lib/fetch";

export async function markAttendance(joinCode: string): Promise<Response> {
  return pfetch(`/attendance/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ joinCode }),
  });
}

export async function getAttendances(lectureId: number): Promise<Response> {
  return pfetch(`/attendance/${encodeURIComponent(lectureId)}`, {
    method: 'GET',
  })
}