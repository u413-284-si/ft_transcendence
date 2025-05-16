import { deleteTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./GameView.js";
import NewTournament from "./NewTournament.js";

export default class extends AbstractView {
  private player1: string | null = null;
  private player2: string | null = null;
  private matchNumber: number | null = null;
  private roundNumber: number | null = null;

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
    this.roundNumber = match.round;
  }

  async createHTML() {
    return /* HTML */ `
      <div class="max-w-4xl mx-auto p-4">
        <section class="mb-10">
          <div
            class="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md max-w-xl mx-auto text-center space-y-4"
          >
            <h1 class="text-3xl font-bold text-blue-600">
              Get ready for the next match!
            </h1>

            <p class="text-xl text-gray-800">
              <strong
                >Round ${this.roundNumber} - Match ${this.matchNumber}</strong
              >
            </p>

            <p class="text-xl text-gray-700">
              <strong>${this.player1}</strong> vs
              <strong>${this.player2}</strong>
            </p>

            <form id="match-form">
              <button
                type="submit"
                class="mt-5 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Start Match
              </button>
            </form>
          </div>
        </section>

        <hr class="border-gray-300 mb-6" />

        <section>
          <div
            class="bg-white border border-gray-300 rounded-xl p-6 shadow-md max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 class="text-2xl font-semibold text-gray-700">
              Tournament Status
            </h2>

            <div class="mb-6">${this.tournament.getBracketAsHTML()}</div>

            <div>
              <button
                id="abort-tournament"
                class="mt-4 px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
              >
                Abort Tournament
              </button>
            </div>
          </div>
        </section>
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
