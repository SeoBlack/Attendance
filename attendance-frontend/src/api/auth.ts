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
}
export async function requestSignup(options: SignupOptions){
  return pfetch(`/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })
}