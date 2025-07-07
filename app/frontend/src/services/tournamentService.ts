import { Tournament } from "../Tournament.js";
import { TournamentDTO } from "../types/ITournament.js";
import { apiFetch } from "./api.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createTournament(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  const apiResponse = await apiFetch<TournamentDTO>("/api/tournaments", {
    method: "POST",
    body: JSON.stringify(tournament) // uses toJSON()
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function setTournamentFinished(
  tournamentId: number
): Promise<ApiResponse<TournamentDTO>> {
  const apiResponse = await apiFetch<TournamentDTO>(
    `/api/tournaments/${tournamentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "FINISHED" })
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function updateTournamentBracket(
  tournament: Tournament
): Promise<ApiResponse<TournamentDTO>> {
  const tournamentId = tournament.getId();
  const apiResponse = await apiFetch<TournamentDTO>(
    `/api/tournaments/${tournamentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ bracket: JSON.stringify(tournament.getBracket()) })
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function getUserTournaments(): Promise<ApiResponse<TournamentDTO[]>> {
  const apiResponse = await apiFetch<TournamentDTO[]>(
    "/api/users/me/tournaments",
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function getActiveTournament(): Promise<ApiResponse<TournamentDTO | null>> {
  const apiResponse = await apiFetch<TournamentDTO | null>(
    `/api/users/me/tournaments/active`,
    {
      method: "GET"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function deleteTournament(id: number): Promise<ApiResponse<TournamentDTO>> {
  const apiResponse = await apiFetch<TournamentDTO>(`/api/tournaments/${id}`, {
    method: "DELETE"
  });

  console.log(apiResponse);
  return apiResponse;
}
