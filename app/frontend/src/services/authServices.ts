import { apiFetch } from "./api.js";
import { Token } from "../types/Token.js";

export async function authorizeUser(): Promise<Token> {
  const apiResponse = await apiFetch<Token>("http://localhost:4000/api/auth/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function userLogin(
  usernameOrEmail: string,
  password: string
): Promise<Token> {
  const apiResponse = await apiFetch<Token>("http://localhost:4000/api/auth/", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify({ usernameOrEmail, password })
  });

  console.log(apiResponse);
  return apiResponse.data;
}
