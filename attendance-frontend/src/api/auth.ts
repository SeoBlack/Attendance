import {pfetch} from "./lib/fetch";

export enum USER_ROLE {
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export type SignupOptions = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: USER_ROLE;
}

export type SignInPayload = {
  email: string;
  password: string;
}
export async function requestSignup(options: SignupOptions){
  console.log(options)
  return pfetch(`/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })
}

export async function signIn(authPayload: SignInPayload){
  return pfetch(`/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authPayload)
  })
}