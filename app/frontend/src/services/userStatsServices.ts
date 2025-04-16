import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";

export async function getUserStats(): Promise<UserStats> {
  const apiResponse = await apiFetch<UserStats>(`/api/users/user-stats/`, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}
