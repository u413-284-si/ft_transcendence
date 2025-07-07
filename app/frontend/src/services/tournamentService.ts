import { Tournament } from "../Tournament.js";
import { TournamentDTO } from "../types/ITournament.js";
import { apiFetch } from "./api.js";
import { ApiResponse } from "../types/IApiResponse.js";

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
    body: JSON.stringify({ status: "FINISHED" })
  });
}

export async function updateTournamentBracket(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  const tournamentId = tournament.getId();
  const url = `/api/tournaments/${tournamentId}`;

  return apiFetch<TournamentDTO>(url, {
    method: "PATCH",
    body: JSON.stringify({ bracket: JSON.stringify(tournament.getBracket()) })
  });
}

export async function getUserTournaments(): Promise<
  ApiResponse<TournamentDTO[]>
> {
  const url = "/api/users/me/tournaments";

  return apiFetch<TournamentDTO[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getActiveTournament(): Promise<
  ApiResponse<TournamentDTO | null>
> {
  const url = `/api/users/me/tournaments/active`;

  return apiFetch<TournamentDTO | null>(url, {
    method: "GET"
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
