import { Tournament } from "../Tournament.js";
import { TournamentDTO } from "../types/ITournament.js";
import { ApiError, apiFetch } from "./api.js";
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

export async function getUserTournaments(
  name?: string
): Promise<ApiResponse<TournamentDTO[]>> {
  let url = "/api/users/me/tournaments";

  if (name) {
    const params = new URLSearchParams({ name });
    url += `?${params.toString()}`;
  }

  return apiFetch<TournamentDTO[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getActiveTournament(): Promise<
  ApiResponse<TournamentDTO | null>
> {
  const url = `/api/users/me/tournaments?isFinished=false`;

  const apiResponse = await apiFetch<TournamentDTO[]>(url, {
    method: "GET"
  });

  if (!apiResponse.success) {
    throw new ApiError(apiResponse);
  }

  const firstTournament =
    apiResponse.data && apiResponse.data.length > 0
      ? apiResponse.data[0]
      : null;

  return {
    ...apiResponse,
    data: firstTournament
  };
}

export async function deleteTournament(
  id: number
): Promise<ApiResponse<TournamentDTO>> {
  const url = `/api/tournaments/${id}`;

  return apiFetch<TournamentDTO>(url, {
    method: "DELETE"
  });
}
