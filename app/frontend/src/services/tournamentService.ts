import { Tournament } from "../Tournament.js";
import { TournamentDTO } from "../types/ITournament.js";
import { apiFetch } from "./api.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createTournament(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  return apiFetch<TournamentDTO>("/api/tournaments", {
    method: "POST",
    body: JSON.stringify(tournament) // uses toJSON()
  });
}

export async function setTournamentFinished(
  tournamentId: number
): Promise<ApiResponse<TournamentDTO>> {
  return apiFetch<TournamentDTO>(`/api/tournaments/${tournamentId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "FINISHED" })
  });
}

export async function updateTournamentBracket(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  const tournamentId = tournament.getId();

  return apiFetch<TournamentDTO>(`/api/tournaments/${tournamentId}`, {
    method: "PATCH",
    body: JSON.stringify({ bracket: JSON.stringify(tournament.getBracket()) })
  });
}

export async function getUserTournaments(): Promise<
  ApiResponse<TournamentDTO[]>
> {
  return apiFetch<TournamentDTO[]>("/api/users/me/tournaments", {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getActiveTournament(): Promise<
  ApiResponse<TournamentDTO | null>
> {
  return apiFetch<TournamentDTO | null>(`/api/users/me/tournaments/active`, {
    method: "GET"
  });
}

export async function deleteTournament(
  id: number
): Promise<ApiResponse<TournamentDTO>> {
  return apiFetch<TournamentDTO>(`/api/tournaments/${id}`, {
    method: "DELETE"
  });
}
