import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";
import { ApiResponse } from "../types/IApiResponse.js";
import { DashboardMatches, DashboardTournaments } from "../types/DataSeries.js";

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

export async function getUserDashboardMatchesByUsername(
  username: string
): Promise<ApiResponse<DashboardMatches>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/user-stats/${encoded}/dashboard-matches`;

  return apiFetch<DashboardMatches>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserDashboardTournamentsByUsername(
  username: string
): Promise<ApiResponse<DashboardTournaments>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/user-stats/${encoded}/dashboard-tournaments`;

  return apiFetch<DashboardTournaments>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}
