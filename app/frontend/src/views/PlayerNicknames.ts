import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import { createTournament } from "../services/tournamentService.js";
import { validateNicknames } from "../validate.js";

export default class extends AbstractView {
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
    document
      .getElementById("nicknames-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndStartTournament(event)
      );
  }

  async render() {
    await this.updateHTML();
    this.addListeners();
  }

  private async validateAndStartTournament(event: Event) {
    event.preventDefault();
    const nicknames = this.extractNicknames();
    if (!validateNicknames(nicknames, event)) return;

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

  private extractNicknames(): string[] {
    const form = document.getElementById("nicknames-form") as HTMLFormElement;
    const nicknames: string[] = [];

    for (let i = 1; i <= this.numberOfPlayers; i++) {
      const nicknameInput: string = (
        form.querySelector(`input[name="player${i}"]`) as HTMLInputElement
      ).value;
      nicknames.push(nicknameInput);
    }
    return nicknames;
  }
}
