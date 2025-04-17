import { Tournament } from "../Tournament.js";
import { TournamentDTO } from "../types/ITournament.js";
import { apiFetch } from "./api.js";

export async function createTournament(
  tournament: Tournament
): Promise<TournamentDTO> {
  const apiResponse = await apiFetch<TournamentDTO>("/api/tournaments", {
    method: "POST",
    body: JSON.stringify(tournament) // uses toJSON()
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function setTournamentFinished(
  tournamentId: number
): Promise<TournamentDTO> {
  const apiResponse = await apiFetch<TournamentDTO>(
    `/api/tournaments/${tournamentId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "FINISHED" })
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function updateTournamentBracket(
  tournament: Tournament
): Promise<TournamentDTO> {
  const tournamentId = tournament.getId();
  const apiResponse = await apiFetch<TournamentDTO>(
    `/api/tournaments/${tournamentId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ bracket: JSON.stringify(tournament.getBracket()) })
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getActiveTournament(): Promise<TournamentDTO | null> {
  const apiResponse = await apiFetch<TournamentDTO | null>(
    `/api/users/tournaments/active/`,
    {
      method: "GET"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function deleteTournament(id: number): Promise<TournamentDTO> {
  const apiResponse = await apiFetch<TournamentDTO>(`/api/tournaments/${id}/`, {
    method: "DELETE"
  });

  console.log(apiResponse);
  return apiResponse.data;
}
