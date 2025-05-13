import { FormTracker } from "../FormTracker.js";
import { router } from "../Router.js";
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
  private formElement!: HTMLFormElement;
  private formTracker!: FormTracker;

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
          <span
            id="tournamentName-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
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
          ></span>
        </div>
        <button type="submit">Start Tournament</button>
      </form>
      ${footerHTML}
    `;
  }

  async addListeners() {
    this.formElement.addEventListener("submit", (event) =>
      this.validateAndRequestNicknames(event)
    );
  }

  async render() {
    try {
      const activeTournament = await getActiveTournament();
      if (!activeTournament) {
        console.log("No active tournament found");
        await this.updateHTML();
        this.formElement = document.querySelector("#tournament-form")!;
        this.formTracker = new FormTracker(this.formElement);
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
      router.switchView(matchAnnouncementView);
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
    const tournamentErrorEl = document.getElementById(
      "tournamentName-error"
    ) as HTMLElement;
    const playerErrorEl = document.getElementById(
      "player-error"
    ) as HTMLElement;
    let isValid = true;

    if (!(await validateTournamentName(tournamentNameEl, tournamentErrorEl))) {
      isValid = false;
    }
    if (
      !validatePlayersSelection(playersSelected, selectionEl, playerErrorEl)
    ) {
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    const playerNum = parseInt(playersSelected.value);
    console.log(
      `Tournament "${tournamentNameEl.value}" started with ${playerNum} players`
    );

    this.formTracker.reset();

    // Navigate to the PlayerNicknames view
    const playerNicknamesView = new PlayerNicknames(
      playerNum,
      tournamentNameEl.value
    );
    router.switchView(playerNicknamesView);
  }

  getName(): string {
    return "new-tournament";
  }

  async confirmLeave(): Promise<boolean> {
    if (this.canLeave()) return true;
    return confirm("You have unsaved changes. Do you really want to leave?");
  }

  canLeave(): boolean {
    return !this.formTracker?.isDirty();
  }
}
