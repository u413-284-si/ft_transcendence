import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";

export async function getUserStats(): Promise<UserStats> {
  const apiResponse = await apiFetch<UserStats>(`/api/users/me/user-stats`, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserStatsByUsername(
  username: string
): Promise<UserStats | null> {
  const encoded = encodeURIComponent(username);
  const url = `/api/user-stats/?username=${encoded}`;

  const apiResponse = await apiFetch<UserStats[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  if (!apiResponse.data.length) {
    return null;
  }

  return apiResponse.data[0];
}
