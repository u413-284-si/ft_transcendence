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
}
