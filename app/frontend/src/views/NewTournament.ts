import { getActiveTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import { BracketMatch } from "../types/IMatch.js";
import AbstractView from "./AbstractView.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import PlayerNicknames from "./PlayerNicknames.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Tournament");
  }

  async createHTML() {
    return `
            <h1 style="
                margin-bottom: 40px;
                font-size: 2.5em;
                color: #FF00AA;
                text-align: center;
                text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);"
            >
                New Tournament
            </h1>
            <p style="margin-bottom: 20px;">Enter the tournament name and select the number of players:</p>
            <form id="tournament-form">
                <label style="font-size: 1.2em; font-weight: bold; display: block; margin-bottom: 10px;">
                    Tournament Name:
                    <input
                        type="text"
                        name="tournamentName"
                        required
                        style="width: 30%; padding: 10px; font-size: 1em; border: 2px solid #007BFF; border-radius: 5px; margin-top: 5px;"
                    >
                </label><br><br>
                <label>
                    <input type="radio" name="players" value="4" required> 4 Players
                </label><br>
                <label>
                    <input type="radio" name="players" value="8"> 8 Players
                </label><br>
                <label>
                    <input type="radio" name="players" value="16"> 16 Players
                </label><br>
                <button type="submit">Start Tournament</button>
            </form>
            `;
  }

  async addListeners() {
    document
      .getElementById("tournament-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndRequestNicknames(event)
      );
  }

  async render() {
    try {
      const activeTournament = await getActiveTournament();
      if (!activeTournament) {
        console.log("No active tournament found");
        await this.updateHTML();
        this.addListeners();
        return;
      }
      const bracket = JSON.parse(activeTournament.bracket) as BracketMatch[];
      const tournament = new Tournament(
        activeTournament.name,
        activeTournament.maxPlayers,
        activeTournament.adminId,
        bracket,
        activeTournament.id
      );
      const matchAnnouncementView = new MatchAnnouncement(tournament);
      matchAnnouncementView.render();
      return;
    } catch (error) {
      console.error(error);
      // show error page
    }
  }

  validateAndRequestNicknames(event: Event) {
    const form = document.getElementById("tournament-form") as HTMLFormElement;
    const players = form?.querySelector(
      'input[name="players"]:checked'
    ) as HTMLInputElement;
    const tournamentNameInput = form?.querySelector(
      'input[name="tournamentName"]'
    ) as HTMLInputElement;

    if (!players) {
      event.preventDefault();
      return alert("Please select the number of players.");
    }

    if (!tournamentNameInput) {
      event.preventDefault();
      return alert("Please enter a tournament name.");
    }

    event.preventDefault();
    const selectedPlayers = parseInt(players.value);
    const tournamentName = tournamentNameInput.value.trim();
    console.log(
      `Tournament "${tournamentName}" started with ${selectedPlayers} players`
    );

    // Navigate to the PlayerNicknames view
    const playerNicknamesView = new PlayerNicknames(
      selectedPlayers,
      tournamentName
    );
    playerNicknamesView.render();
  }
}
