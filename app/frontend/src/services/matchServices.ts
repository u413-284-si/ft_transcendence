import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";

export async function createMatch(match: Match): Promise<Match> {
  const apiResponse = await apiFetch<Match>(
    "http://localhost:4000/api/matches/",
    {
      method: "POST",
      body: JSON.stringify(match),
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}
