export enum USER_ROLE {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
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
  // TODO: implement
  let resp = await fetch('http://localhost:8081/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(options)
  })
  console.log(resp)
}