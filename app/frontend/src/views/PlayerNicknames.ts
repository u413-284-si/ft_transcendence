import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import { createTournament } from "../services/tournamentService.js";
import { validateNicknames } from "../validate.js";
import { router } from "../Router.js";
import { auth } from "../AuthManager.js";
import { FormTracker } from "../FormTracker.js";

export default class extends AbstractView {
  private formElement!: HTMLFormElement;
  private formTracker!: FormTracker;

  constructor(
    private numberOfPlayers: number,
    private tournamentName: string
  ) {
    super();
    this.setTitle("Enter Player Nicknames");
  }

  async createHTML() {
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

  async addListeners() {
    document
      .getElementById("nicknames-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndStartTournament(event)
      );
  }

  async render() {
    await this.updateHTML();
    this.formElement = document.querySelector("#nicknames-form")!;
    this.formTracker = new FormTracker(this.formElement);
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

    try {
      const userId = auth.getToken()?.id;
      if (!userId) throw new Error("User Id is undefined");
      const tournament = Tournament.fromUsernames(
        nicknames,
        this.tournamentName,
        this.numberOfPlayers,
        userId
      );

      const createdTournament = await createTournament(tournament);
      const { id } = createdTournament;
      if (id) {
        tournament.setId(id);
      }
      const nextMatch = tournament.getNextMatchToPlay();
      if (!nextMatch) {
        throw new Error("Match is undefined");
      }
      this.formTracker.reset();
      const matchAnnouncementView = new MatchAnnouncement(tournament);
      router.navigateInternally(matchAnnouncementView);
    } catch (error) {
      console.error("Error creating tournament", error);
    }
  }

  getName(): string {
    return "player-nicknames";
  }

  async confirmLeave(): Promise<boolean> {
    if (!this.formTracker?.isDirty()) return true;
    return confirm("You have unsaved changes. Do you really want to leave?");
  }
}
