import { pfetch } from "./lib/fetch";

export async function getDashboard(): Promise<Response> {
  return pfetch(`/student/dashboard`, {
    method: 'GET',
  });
}

export async function getHistory(): Promise<Response> {
  return pfetch(`/student/history`, {
    method: 'GET',
  });
}
