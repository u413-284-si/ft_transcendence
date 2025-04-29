import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import { createTournament } from "../services/tournamentService.js";
import { hasDuplicates } from "../validate.js";
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
      nicknameInputs += `
        <label style="display: block; margin-bottom: 10px;">
          Player ${i} Nickname:
          <input
            type="text"
            name="player${i}"
            style="width: 50%; padding: 10px; font-size: 1em; border: 2px solid #007BFF; border-radius: 5px; margin-top: 5px;"
          >
        </label>
      `;
    }

    return `
            <h1 style="
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
            <form id="nicknames-form">
              ${nicknameInputs}
              <button type="submit" style="
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
            </form>
            `;
  }

  async addListeners() {
    this.formElement.addEventListener("submit", (event) =>
      this.initTournament(event)
    );
  }

  async render() {
    await this.updateHTML();
    this.formElement = document.querySelector("#nicknames-form")!;
    this.formTracker = new FormTracker(this.formElement);
    this.addListeners();
  }

  private extractNicknames(): string[] {
    const form = document.getElementById("nicknames-form") as HTMLFormElement;
    const nicknames: string[] = [];
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      const nicknameInput: string = (
        form.querySelector(`input[name="player${i}"]`) as HTMLInputElement
      ).value.trim();
      if (nicknameInput !== "") {
        nicknames.push(nicknameInput);
      } else {
        alert("Please enter a nickname for all players");
        return [];
      }
    }
    if (hasDuplicates(nicknames)) {
      alert("Nicknames must be unique");
      return [];
    }
    return nicknames;
  }

  private async initTournament(event: Event) {
    event.preventDefault();
    const nicknames = this.extractNicknames();
    if (nicknames.length === 0) {
      return;
    }
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
