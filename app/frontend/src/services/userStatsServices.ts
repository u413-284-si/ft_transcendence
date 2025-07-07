import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function getUserStats(): Promise<ApiResponse<UserStats>> {
  const apiResponse = await apiFetch<UserStats>(`/api/users/me/user-stats`, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function getUserStatsByUsername(
  username: string
): Promise<ApiResponse<UserStats[]>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/user-stats/?username=${encoded}`;

  const apiResponse = await apiFetch<UserStats[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}
