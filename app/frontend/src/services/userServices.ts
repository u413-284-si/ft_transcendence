import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { Token } from "../types/Token.js";

export async function getUserMatches(): Promise<Match[]> {
  const apiResponse = await apiFetch<Match[]>("/api/users/matches/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserByUsername(
  username: string
): Promise<Token | null> {
  const apiResponse = await apiFetch<Token | null>(
    `/api/users/search/?username=${encodeURIComponent(username)}`,
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}
