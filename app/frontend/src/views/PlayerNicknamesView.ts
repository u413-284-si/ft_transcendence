import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import { createTournament } from "../services/tournamentService.js";
import { validateNicknames } from "../validate.js";

export default class NewTournamentView extends AbstractView {
  constructor(
    private numberOfPlayers: number,
    private tournamentName: string
  ) {
    super();
    this.setTitle("Enter Player Nicknames");
  }

  createHTML() {
    let nicknameInputs = "";
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      nicknameInputs += /* HTML */ `
        <div class="w-[800px]">
          <label style="display: block; margin-bottom: 10px;">
            Player ${i} Nickname:
            <input
              type="text"
              name="player${i}"
              class="border border-gray-300 rounded px-2 py-1 transition-all duration-300"
            />
          </label>
          <span
            id="player-error${i}"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
      `;
    }

    return /* HTML */ `
      <h1
        style="
              margin-bottom: 20px;
              font-size: 2em;
              color: #007BFF;
              text-align: center;"
      >
        Enter Player Nicknames
      </h1>
      <p style="margin-bottom: 20px; text-align: center;">
        Tournament: <strong>${this.tournamentName}</strong>
      </p>
      <form
        id="nicknames-form"
        class="flex flex-col justify-center items-center h-screen gap-4"
      >
        ${nicknameInputs}
        <div>
          <button
            type="submit"
            style="
              margin-top: 20px;
              padding: 10px 20px;
              font-size: 1em;
              background-color: #007BFF;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;"
          >
            Submit Nicknames
          </button>
        </div>
      </form>
    `;
  }

  protected addListeners() {
    document
      .getElementById("nicknames-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndStartTournament(event)
      );
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private async validateAndStartTournament(event: Event) {
    event.preventDefault();
    const form = document.getElementById("nicknames-form") as HTMLFormElement;
    const inputElements: HTMLInputElement[] = Array.from(
      form.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      form.querySelectorAll("span.error-message")
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;

    const tournament = Tournament.fromUsernames(
      nicknames,
      this.tournamentName,
      this.numberOfPlayers,
      1 // FIXME: Hard coded username
    );

    try {
      const createdTournament = await createTournament(tournament);
      const { id } = createdTournament;
      if (id) {
        tournament.setId(id);
      }
      const nextMatch = tournament.getNextMatchToPlay();
      if (!nextMatch) {
        throw new Error("Match is undefined");
      }
      const matchAnnouncementView = new MatchAnnouncement(tournament);
      matchAnnouncementView.render();
    } catch (e) {
      console.error("Error creating tournament", e);
    }
  }
}
