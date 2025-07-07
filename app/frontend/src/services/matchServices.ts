import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createMatch(match: Match): Promise<ApiResponse<Match>> {
  const apiResponse = await apiFetch<Match>("/api/matches", {
    method: "POST",
    body: JSON.stringify(match),
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}
