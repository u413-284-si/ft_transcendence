import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";
import { ApiResponse } from "../types/IApiResponse.js";

import {
  DashboardMatches,
  ScoreDiffSeries,
  ScoresLastNDaysSeries,
  TournamentProgressSeries,
  TournamentSummarySeries,
  WinrateSeries
} from "../types/DataSeries.js";

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

export async function getUserTournamentSummary(): Promise<
  ApiResponse<TournamentSummarySeries>
> {
  const url = "/api/user-stats/me/tournament-summary";

  return apiFetch<TournamentSummarySeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserWinrateProgression(): Promise<
  ApiResponse<WinrateSeries>
> {
  const url = "/api/user-stats/me/winrate-progression";

  return apiFetch<WinrateSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserScoreDiff(): Promise<
  ApiResponse<ScoreDiffSeries>
> {
  const url = "/api/user-stats/me/score-diff";

  return apiFetch<ScoreDiffSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserScoresLastTen(): Promise<
  ApiResponse<ScoresLastNDaysSeries>
> {
  const url = "/api/user-stats/me/scores-last-ten";

  return apiFetch<ScoresLastNDaysSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserTournamentProgress(): Promise<
  ApiResponse<TournamentProgressSeries>
> {
  const url = "/api/user-stats/me/tournament-progress";

  return apiFetch<TournamentProgressSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserDashboardMatches(): Promise<
  ApiResponse<DashboardMatches>
> {
  const url = "/api/user-stats/me/dashboard-matches";

  return apiFetch<DashboardMatches>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}
