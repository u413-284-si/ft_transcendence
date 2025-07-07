import { apiFetch } from "./api.js";
import { Token } from "../types/Token.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function authAndDecodeAccessToken(): Promise<ApiResponse<Token>> {
  return apiFetch<Token>("/api/auth/token", {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function refreshAccessToken(): Promise<ApiResponse<null>> {
  return apiFetch<null>(
    "/api/auth/refresh",
    {
      method: "GET",
      credentials: "same-origin"
    },
    false
  );
}

export async function userLogin(
  usernameOrEmail: string,
  password: string
): Promise<ApiResponse<{ username: string }>> {
  return apiFetch<{ username: string }>("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ usernameOrEmail, password })
  });
}

export async function userLogout(): Promise<ApiResponse<{ username: string }>> {
  return apiFetch<{ username: string }>(
    "/api/auth/logout",
    {
      method: "PATCH",
      credentials: "same-origin"
    },
    false
  );
}
