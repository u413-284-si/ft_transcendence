import { apiFetch } from "./api.js";
import { Token } from "../types/Token.js";

export async function authAndDecode(): Promise<Token> {
  const apiResponse = await apiFetch<Token>("/api/auth/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
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
