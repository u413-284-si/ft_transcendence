import { apiFetch } from "./api.js";
import { Token } from "../types/Token.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function authAndDecodeAccessToken(): Promise<ApiResponse<Token>> {
  const apiResponse = await apiFetch<Token>("/api/auth/token", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function refreshAccessToken() {
  const apiResponse = await apiFetch<null>(
    "/api/auth/refresh",
    {
      method: "GET",
      credentials: "same-origin"
    },
    false
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function userLogin(
  usernameOrEmail: string,
  password: string
): Promise<ApiResponse<{ username: string }>> {
  const apiResponse = await apiFetch<{ username: string }>("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ usernameOrEmail, password })
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function userLogout(): Promise<ApiResponse<{ username: string }>> {
  const apiResponse = await apiFetch<{ username: string }>(
    "/api/auth/logout",
    {
      method: "PATCH",
      credentials: "same-origin"
    },
    false
  );

  console.log(apiResponse);
  return apiResponse;
}
