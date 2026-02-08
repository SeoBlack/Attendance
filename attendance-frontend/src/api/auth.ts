import {pfetch} from "./lib/fetch";

export enum USER_ROLE {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export type SignupOptions = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: USER_ROLE;
  studentId?: string;
}
export async function requestSignup(options: SignupOptions){
  let resp = await pfetch(`/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })
  return resp.json();
}