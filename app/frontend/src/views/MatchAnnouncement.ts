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
      <div class="max-w-4xl mx-auto p-4">
        <h1 class="mb-5 text-3xl font-bold text-blue-600 text-center">
          Match ${this.matchNumber}
        </h1>

        <p class="mb-5 text-center text-xl">
          <strong>${this.player1}</strong> vs <strong>${this.player2}</strong>
        </p>

        <div class="text-center">
          <form id="match-form">
            <button
              type="submit"
              class="mt-5 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Start Match
            </button>
          </form>
        </div>

        <div>${this.tournament.getBracketAsHTML()}</div>

        <div class="text-center mt-4">
          <button
            id="abort-tournament"
            class="mt-4 px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
          >
            Abort Tournament
          </button>
        </div>
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
