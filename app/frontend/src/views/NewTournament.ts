import { getActiveTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import { BracketMatch } from "../types/IMatch.js";
import AbstractView from "./AbstractView.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import PlayerNicknames from "./PlayerNicknames.js";
import {
  validateTournamentName,
  validatePlayersSelection
} from "../validate.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Tournament");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <h1
        style="
          margin-bottom: 40px;
          font-size: 2.5em;
          color: #FF00AA;
          text-align: center;
          text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);"
      >
        New Tournament
      </h1>
      <p class="text-center mb-5">
        Enter the tournament name and select the number of players:
      </p>
      <form
        id="tournament-form"
        class="flex flex-col justify-center items-center gap-4"
      >
        <div class="w-[300px]">
          <label
            style="font-size: 1.2em; font-weight: bold; display: block; margin-bottom: 10px;"
          >
            Tournament Name:
            <input
              type="text"
              name="tournamentName"
              class="border border-gray-300 rounded px-2 py-1 transition-all duration-300"
            />
          </label>
        </div>
        <br /><br />
        <div id="player-options" class="rounded px-2 py-1 w-[300px]">
          <label class="block">
            <input type="radio" name="players" value="4" /> 4 Players
          </label>
          <label class="block">
            <input type="radio" name="players" value="8" /> 8 Players
          </label>
          <label class="block">
            <input type="radio" name="players" value="16" /> 16 Players
          </label>
          <span
            id="player-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
            >Please select number of players.</span
          >
        </div>
        <button type="submit">Start Tournament</button>
      </form>
      ${footerHTML}
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

  async validateAndRequestNicknames(event: Event) {
    event.preventDefault();
    const form = document.getElementById("tournament-form") as HTMLFormElement;
    const playersSelected = form?.querySelector(
      'input[name="players"]:checked'
    ) as HTMLInputElement;
    const tournamentNameEl = form?.querySelector(
      'input[name="tournamentName"]'
    ) as HTMLInputElement;
    const selectionEl = document.getElementById(
      "player-options"
    ) as HTMLInputElement;
    const errorEl = document.getElementById("player-error") as HTMLInputElement;

    if (
      !(await validateTournamentName(tournamentNameEl)) ||
      !validatePlayersSelection(playersSelected, selectionEl, errorEl)
    )
      return;

    const playerNum = parseInt(playersSelected.value);
    console.log(
      `Tournament "${tournamentNameEl.value}" started with ${playerNum} players`
    );

    // Navigate to the PlayerNicknames view
    const playerNicknamesView = new PlayerNicknames(
      playerNum,
      tournamentNameEl.value
    );
    playerNicknamesView.render();
  }
}
