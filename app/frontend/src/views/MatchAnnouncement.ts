import { deleteTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./GameView.js";
import NewTournament from "./NewTournament.js";

export default class extends AbstractView {
  private player1: string | null = null;
  private player2: string | null = null;
  private matchNumber: number | null = null;

  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Match Announcement");
    const match = this.tournament.getNextMatchToPlay();
    if (!match) {
      throw new Error("Match is undefined");
    }
    this.player1 = match.player1;
    this.player2 = match.player2;
    this.matchNumber = match.matchId;
  }

  async createHTML() {
    return /* HTML */ `
      <h1
        style="
        margin-bottom: 20px;
        font-size: 2em;
        color: #007BFF;
        text-align: center;"
      >
        Match ${this.matchNumber}
      </h1>
      <p style="margin-bottom: 20px; text-align: center; font-size: 1.5em;">
        <strong>${this.player1}</strong> vs <strong>${this.player2}</strong>
      </p>
      <div style="text-align: center;">
        <form id="match-form">
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
            Start Match
          </button>
        </form>
      </div>
      <div>
        <button
          id="abort-tournament"
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
          Abort Tournament
        </button>
      </div>
    `;
  }

  async addListeners() {
    document
      .getElementById("match-form")
      ?.addEventListener("submit", (event) => this.callGameView(event));
    document
      .getElementById("abort-tournament")
      ?.addEventListener("click", () => this.abortTournament());
  }

  async render() {
    await this.updateHTML();
    this.addListeners();
  }

  private callGameView(event: Event) {
    event.preventDefault();
    console.log(
      `Match ${this.matchNumber} started: ${this.player1} vs ${this.player2}`
    );

    if (!this.player1 || !this.player2) {
      console.error("Player names are not set.");
      return;
    }

    const gameView = new GameView(
      this.player1,
      this.player2,
      GameType.tournament,
      this.tournament
    );
    gameView.render();
  }

  private async abortTournament() {
    try {
      await deleteTournament(this.tournament.getId());
      const newTournamentView = new NewTournament();
      newTournamentView.render();
    } catch (error) {
      console.error(error);
      // show error page
    }
  }
}
