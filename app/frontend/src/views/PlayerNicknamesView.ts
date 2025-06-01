import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import { createTournament } from "../services/tournamentService.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";

export default class PlayerNicknamesView extends AbstractView {
  private formEl!: HTMLFormElement;

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
      const isChecked = i === 1 ? "checked" : "";

      nicknameInputs += /* HTML */ `
        <div class="w-[800px] border border-gray-200 p-4 rounded shadow-sm">
          <label class="block mb-2 font-medium"> Player ${i} Nickname: </label>
          <input
            type="text"
            name="player${i}"
            id="nickname${i}"
            placeholder="Enter your nickname"
            class="border border-gray-300 rounded px-2 py-1 w-full"
          />
          <div class="mt-2">
            <label class="inline-flex items-center text-sm text-gray-600">
              <input
                type="radio"
                name="userChoice"
                value="${i}"
                class="mr-2"
                ${isChecked}
              />
              I will play as Player ${i}
            </label>
          </div>
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
        Tournament: <strong>${escapeHTML(this.tournamentName)}</strong>
      </p>
      <form
        id="nicknames-form"
        class="flex flex-col justify-center items-center gap-4"
      >
        <p class="text-sm text-gray-500 mb-2 text-center">
          Select which player will be controlled by ${auth.getToken().username}.
        </p>
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
    this.formEl.addEventListener("submit", (event) =>
      this.validateAndStartTournament(event)
    );
  }

  async render() {
    this.updateHTML();
    this.formEl = document.querySelector("#nicknames-form")!;
    this.addListeners();
  }

  private async validateAndStartTournament(event: Event) {
    event.preventDefault();
    const form = document.getElementById("nicknames-form") as HTMLFormElement;
    const formData = new FormData(form);
    const userNumber = formData.get("userChoice");
    const inputElements: HTMLInputElement[] = Array.from(
      this.formEl.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      this.formEl.querySelectorAll("span.error-message")
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;
    const userNickname = formData.get(`player${userNumber}`) as string;

    try {
      const userId = auth.getToken().id;
      const tournament = Tournament.fromUsernames(
        nicknames,
        this.tournamentName,
        this.numberOfPlayers,
        userNickname,
        userId
      );

      const createdTournament = await createTournament(tournament);
      const { id } = createdTournament;
      if (id) {
        tournament.setId(id);
      }
      const matchAnnouncementView = new MatchAnnouncement(tournament);
      router.switchView(matchAnnouncementView);
    } catch (error) {
      router.handleError("Error creating tournament", error);
    }
  }

  getName(): string {
    return "player-nicknames";
  }
}
