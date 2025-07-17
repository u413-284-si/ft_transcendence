import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createMatch(match: Match): Promise<ApiResponse<Match>> {
  const url = "/api/matches";

  return apiFetch<Match>(url, {
    method: "POST",
    body: JSON.stringify(match),
    credentials: "same-origin"
  });
}
