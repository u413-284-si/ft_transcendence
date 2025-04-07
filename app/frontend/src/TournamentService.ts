import { Tournament } from "./Tournament";
import { ApiResponse } from "./types/IApiResponse";
import { TournamentDTO } from "./types/ITournament";

export default class TournamentService {
  static async createTournament(
    tournament: Tournament
  ): Promise<TournamentDTO> {
    const response = await fetch("http://localhost:4000/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tournament) // uses toJSON()
    });

    if (!response.ok) {
      throw new Error("Failed to create tournament");
    }

    const data: ApiResponse<TournamentDTO> = await response.json();
    console.log(data);
    const savedTournament = data.data;
    return savedTournament;
  }

  static async setTournamentFinished(
    tournamentId: number
  ): Promise<TournamentDTO> {
    const response = await fetch(
      `http://localhost:4000/api/tournaments/${tournamentId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "FINISHED" })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update tournament");
    }

    const data: ApiResponse<TournamentDTO> = await response.json();
    console.log(data);
    const updatedTournament = data.data;
    return updatedTournament;
  }

  static async updateTournamentBracket(
    tournament: Tournament
  ): Promise<TournamentDTO> {
    const tournamentId = tournament.getId();
    const response = await fetch(
      `http://localhost:4000/api/tournaments/${tournamentId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tournament)
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update tournament");
    }

    const data: ApiResponse<TournamentDTO> = await response.json();
    console.log(data);
    const updatedTournament = data.data;
    return updatedTournament;
  }

  static async getActiveTournament(): Promise<TournamentDTO | null> {
    const userId = 1; // FIXME: Hard coded user id
    const response = await fetch(
      `http://localhost:4000/api/users/${userId}/tournaments/active/`,
      {
        method: "GET"
      }
    );

    if (response.status == 404) {
      console.log("No active Tournament found (404)");
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch active tournament");
    }

    const data: ApiResponse<TournamentDTO> = await response.json();
    return data.data;
  }

  static async deleteTournament(id: number): Promise<TournamentDTO> {
    const response = await fetch(
      `http://localhost:4000/api/tournaments/${id}/`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete tournament");
    }

    const data: ApiResponse<TournamentDTO> = await response.json();
    return data.data;
  }
}
