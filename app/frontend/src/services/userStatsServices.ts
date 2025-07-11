import { apiFetch } from "./api.js";
import { UserStats } from "../types/IUserStats.js";
import {
  ScoreDiffSeries,
  ScoresLastTenDaysSeries,
  TournamentProgressSeries,
  WinrateSeries,
} from "../types/DataSeries.js";

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

export async function getUserTournamentProgress(): Promise<TournamentProgressSeries> {
  const url = "/api/user-stats/me/tournament-progress";

  const apiResponse = await apiFetch<TournamentProgressSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserWinrateProgression(): Promise<WinrateSeries> {
  const url = "/api/user-stats/me/winrate-progression";

  const apiResponse = await apiFetch<WinrateSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserScoreDiff(): Promise<ScoreDiffSeries> {
  const url = "/api/user-stats/me/score-diff";

  const apiResponse = await apiFetch<ScoreDiffSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserScoresLastTen(): Promise<ScoresLastTenDaysSeries> {
  const url = "/api/user-stats/me/scores-last-ten";

  const apiResponse = await apiFetch<ScoresLastTenDaysSeries>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}
