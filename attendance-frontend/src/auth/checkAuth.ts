import {USER_ROLE} from "../api/auth";
import {getRawToken} from "./token";

export type AuthenticatedUser = {
  id: string;
  role: USER_ROLE;
}
export function checkAuth() : AuthenticatedUser | null {
  const token = getRawToken()
  if(!token) return null

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}