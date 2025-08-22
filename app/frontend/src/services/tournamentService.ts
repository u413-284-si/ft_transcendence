import { TournamentCreate, TournamentRead } from "../types/ITournament.js";
import { apiFetch } from "./api.js";
import { ApiResponse } from "../types/IApiResponse.js";
import { FetchPageResult } from "../types/FetchPageResult.js";
import { MatchRead } from "../types/IMatch.js";
import { BracketMatchRead } from "../types/BracketMatch.js";

export async function createTournament(
  tournament: TournamentCreate
): Promise<ApiResponse<TournamentRead>> {
  const url = "/api/tournaments";

  return apiFetch<TournamentRead>(url, {
    method: "POST",
    body: JSON.stringify(tournament)
  });
}

export async function setTournamentFinished(
  tournamentId: number
): Promise<ApiResponse<TournamentRead>> {
  const url = `/api/tournaments/${tournamentId}`;

  return apiFetch<TournamentRead>(url, {
    method: "PATCH",
    body: JSON.stringify({ isFinished: true })
  });
}

export async function updateTournamentBracket(
  tournamentId: number,
  matchNumber: number,
  player1Score: number,
  player2Score: number
): Promise<ApiResponse<{ match: MatchRead; bracketMatch: BracketMatchRead }>> {
  const url = `/api/tournaments/${tournamentId}/matches/${matchNumber}`;

  return apiFetch<{ match: MatchRead; bracketMatch: BracketMatchRead }>(url, {
    method: "PATCH",
    body: JSON.stringify({ player1Score, player2Score })
  });
}

export async function getUserTournaments(options: {
  username: string;
  name?: string;
  isFinished?: boolean;
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
}): Promise<ApiResponse<FetchPageResult<TournamentRead>>> {
  const { username, name, isFinished, limit, offset, sort = "desc" } = options;
  const encoded = encodeURIComponent(username);
  let url = `/api/users/${encoded}/tournaments`;

  const params = new URLSearchParams();

  if (name) params.set("name", name);
  if (isFinished !== undefined) params.set("isFinished", String(isFinished));
  if (limit !== undefined) params.set("limit", limit.toString());
  if (offset !== undefined) params.set("offset", offset.toString());
  if (sort) params.set("sort", sort);

  if ([...params].length > 0) {
    url += `?${params.toString()}`;
  }

  return apiFetch(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function deleteTournament(
  id: number
): Promise<ApiResponse<TournamentRead>> {
  const url = `/api/tournaments/${id}`;

  return apiFetch<TournamentRead>(url, {
    method: "DELETE"
  });
}
