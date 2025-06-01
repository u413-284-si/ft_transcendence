import { router } from "../routing/Router.js";
import { deleteTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./GameView.js";
import { escapeHTML } from "../utility.js";

export default class MatchAnnouncementView extends AbstractView {
  private player1: string;
  private player2: string;
  private matchNumber: number;
  private roundNumber: number;
  private userRole: "PLAYERONE" | "PLAYERTWO" | null = null;

  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Match Announcement");
    const match = this.tournament.getNextMatchToPlay();
    if (!match) {
      throw new Error("Match is undefined");
    }
    this.player1 = match.player1!;
    this.player2 = match.player2!;
    this.matchNumber = match.matchId;
    this.roundNumber = match.round;
    const userNickname = tournament.getUserNickname();
    this.userRole =
      this.player1 === userNickname
        ? "PLAYERONE"
        : this.player2 === userNickname
          ? "PLAYERTWO"
          : null;
  }

  createHTML() {
    return /* HTML */ `
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <!-- Match Announcement Card -->
        <section>
          <div
            class="bg-blue-50 border-l-4 border-blue-400 rounded-2xl shadow p-6 text-center space-y-4"
          >
            <h1 class="text-4xl font-extrabold text-blue-700">
              🎮 Next Match!
            </h1>

            <p class="text-lg text-gray-700">
              <span class="font-medium">Round</span> ${this.roundNumber} &mdash;
              <span class="font-medium">Match</span> ${this.matchNumber}
            </p>

            <p class="text-2xl text-gray-900">
              <b>${escapeHTML(this.player1)}</b>
              vs <b>${escapeHTML(this.player2)}</b>
            </p>

            <form id="match-form">
              <button
                type="submit"
                class="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Start Match
              </button>
            </form>
          </div>
        </section>

        <!-- Tournament Status Card -->
        <section>
          <div
            class="bg-white border border-gray-300 rounded-2xl shadow p-6 text-center space-y-6"
          >
            <h2 class="text-2xl font-bold text-gray-800">
              📊 Tournament Status
            </h2>

            <div class="mb-6">${this.tournament.getBracketAsHTML()}</div>

            <div>
              <button
                id="abort-tournament"
                class="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
              >
                Abort Tournament
              </button>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  protected addListeners() {
    document
      .getElementById("match-form")
      ?.addEventListener("submit", (event) => this.callGameView(event));
    document
      .getElementById("abort-tournament")
      ?.addEventListener("click", () => this.abortTournament());
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private callGameView(event: Event) {
    event.preventDefault();
    console.log(
      `Match ${this.matchNumber} started: ${this.player1} vs ${this.player2}`
    );

    const gameView = new GameView(
      this.player1,
      this.player2,
      this.userRole,
      GameType.tournament,
      this.tournament
    );
    router.switchView(gameView);
  }

  private async abortTournament() {
    try {
      if (!confirm("Do you really want to abort the tournament?")) return;
      await deleteTournament(this.tournament.getId());
      router.reload();
    } catch (error) {
      router.handleError("Error while deleting tournament", error);
    }
  }

  getName(): string {
    return "match-announcement";
  }
}
