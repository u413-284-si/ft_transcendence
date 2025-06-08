import { apiFetch } from "./api.js";
import { Token } from "../types/Token.js";

export async function authAndDecodeAccessToken(): Promise<Token> {
  const apiResponse = await apiFetch<Token>("/api/auth/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function refreshAccessToken() {
  const apiResponse = await apiFetch(
    "/api/auth/refresh",
    {
      method: "GET",
      credentials: "same-origin"
    },
    false
  );

  console.log(apiResponse);
}

export async function userLogin(
  usernameOrEmail: string,
  password: string
): Promise<{ username: string }> {
  const apiResponse = await apiFetch<{ username: string }>("/api/auth/", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ usernameOrEmail, password })
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function userLogout() {
  const apiResponse = await apiFetch(
    "/api/auth/logout/",
    {
      method: "POST",
      credentials: "same-origin"
    },
    false
  );

  console.log(apiResponse);
}
