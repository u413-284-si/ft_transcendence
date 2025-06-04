import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { User } from "../types/User.js";

export async function getUserMatches(): Promise<Match[]> {
  const apiResponse = await apiFetch<Match[]>("/api/users/matches/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function registerUser(
  email: string,
  username: string,
  password: string
) {
  const apiResponse = await apiFetch<User>("api/users/", {
    method: "POST",
    body: JSON.stringify({ email, username, password })
  });
  console.log(apiResponse);
  return apiResponse.data;
}
