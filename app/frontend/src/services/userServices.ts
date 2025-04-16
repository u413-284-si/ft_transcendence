import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";

export async function getUserMatches(): Promise<Match[]> {
  const apiResponse = await apiFetch<Match[]>("/api/users/matches/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}
