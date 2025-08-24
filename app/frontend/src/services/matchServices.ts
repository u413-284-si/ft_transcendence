import { apiFetch } from "./api.js";
import { MatchCreate, MatchRead } from "../types/IMatch.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createMatch(
  match: MatchCreate
): Promise<ApiResponse<MatchRead>> {
  const url = "/api/matches";

  return apiFetch<MatchRead>(url, {
    method: "POST",
    body: JSON.stringify(match),
    credentials: "same-origin"
  });
}
