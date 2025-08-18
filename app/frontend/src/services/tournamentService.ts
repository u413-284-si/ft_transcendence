import { Tournament } from "../Tournament.js";
import { TournamentDTO } from "../types/ITournament.js";
import { apiFetch } from "./api.js";
import { ApiResponse } from "../types/IApiResponse.js";
import { FetchPageResult } from "../types/FetchPageResult.js";

export async function createTournament(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  const url = "/api/tournaments";

  return apiFetch<TournamentDTO>(url, {
    method: "POST",
    body: JSON.stringify(tournament) // uses toJSON()
  });
}

export async function setTournamentFinished(
  tournamentId: number
): Promise<ApiResponse<TournamentDTO>> {
  const url = `/api/tournaments/${tournamentId}`;

  return apiFetch<TournamentDTO>(url, {
    method: "PATCH",
    body: JSON.stringify({ isFinished: true })
  });
}

export async function updateTournamentBracket(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  const tournamentId = tournament.getId();
  const url = `/api/tournaments/${tournamentId}`;

  return apiFetch<TournamentDTO>(url, {
    method: "PATCH",
    body: JSON.stringify({
      bracket: JSON.stringify(tournament.getBracket()),
      roundReached: tournament.getRoundReached()
    })
  });
}

export async function getUserTournaments(options: {
  username: string;
  name?: string;
  isFinished?: boolean;
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
}): Promise<ApiResponse<FetchPageResult<TournamentDTO>>> {
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
): Promise<ApiResponse<TournamentDTO>> {
  const url = `/api/tournaments/${id}`;

  return apiFetch<TournamentDTO>(url, {
    method: "DELETE"
  });
}
