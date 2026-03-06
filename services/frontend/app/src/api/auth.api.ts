import api from "./client";
import type { LoginDto, RegisterDto, AuthResponse, User } from "../types/auth.types.ts";

const storeAccessToken = (token?: string) => {
  if (!token) return;
  localStorage.setItem("access_token", token);
};

export const loginApi = async (data: LoginDto) => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  const token = res.data.accessToken ?? res.data.access_token;
  storeAccessToken(token);
  return res.data;
};

export const loginWithGoogleApi = async (token: string) => {
  const res = await api.post<AuthResponse>("/auth/google", { token });
  const accessToken = res.data.accessToken ?? res.data.access_token;
  storeAccessToken(accessToken);
  return res.data;
}

export const registerApi = async (data: RegisterDto) => {
  // Register then immediately log in to obtain tokens (backend currently returns the created user)
  await api.post("/auth/register", data);
  // reuse loginApi to persist token
  return loginApi({ email: data.email, password: data.password });
};

export const refreshApi = async () => {
  const res = await api.post<AuthResponse>("/auth/refresh");
  const token = res.data.accessToken ?? res.data.access_token;
  storeAccessToken(token);
  return res.data;
};

export const logoutApi = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("access_token");
};

export const getMeApi = async (): Promise<User> => {
  const res = await api.get<User>("/auth/me");
  return res.data;
};
