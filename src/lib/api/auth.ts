import { apiRequest } from "./request";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export function signup(payload: SignupPayload) {
  return apiRequest<User>({ method: "POST", url: "/auth/signup", data: payload });
}

export interface CheckPasswordMatchPayload {
  password: string;
  passwordConfirm: string;
}

export function checkPasswordMatch(payload: CheckPasswordMatchPayload) {
  return apiRequest<{ match: boolean }>({
    method: "POST",
    url: "/auth/check-password-match",
    data: payload,
  });
}
