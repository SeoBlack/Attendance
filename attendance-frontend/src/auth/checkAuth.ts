import {USER_ROLE} from "../api/auth";

export type AuthenticatedUser = {
  id: string;
  role: USER_ROLE;
}
export function checkAuth() : AuthenticatedUser | null {
  const token = document.cookie || "test"; // TODO: Get actual token
  if(!token) return null

  return {
    id: "1",
    role: USER_ROLE.TEACHER // TODO: Get role from token
  }
}