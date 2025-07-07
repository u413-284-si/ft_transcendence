import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function getUserStats(): Promise<ApiResponse<UserStats>> {
  const url = `/api/users/me/user-stats`;

  return apiFetch<UserStats>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserStatsByUsername(
  username: string
): Promise<ApiResponse<UserStats[]>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/user-stats/?username=${encoded}`;

  return apiFetch<UserStats[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}
