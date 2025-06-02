import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import { escapeHTML } from "../utility.js";
import { setTournamentFinished } from "../services/tournamentService.js";
import { router } from "../routing/Router.js";

export default class ResultsView extends AbstractView {
  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Results");
  }

  createHTML() {
    return /* HTML */ `
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <!-- Header Section -->
        <div
          class="bg-indigo-50 border-l-4 border-indigo-400 rounded-2xl shadow p-6 text-center"
        >
          <h1 class="text-4xl font-extrabold text-blue-700">
            🎉 Tournament Results 🎉
          </h1>
          <p class="text-xl text-gray-700 mt-2">
            Name: ${escapeHTML(this.tournament.getTournamentName())}
          </p>
        </div>

        <!-- Winner Section -->
        <div
          class="bg-yellow-50 border border-yellow-300 rounded-2xl shadow p-6 text-center space-y-4"
        >
          <h2 class="text-3xl font-extrabold text-yellow-700">Champion</h2>
          <p class="text-2xl font-bold text-gray-800">
            🏆 ${escapeHTML(this.tournament.getTournamentWinner())} 🏆
          </p>
          <p class="text-xl text-gray-600">Congratulations on the victory!</p>
        </div>

        <!-- Bracket Section -->
        <div class="bg-white rounded-2xl shadow p-6 text-center space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">Tournament Bracket</h2>
          <div class="mb-6">${this.tournament.getBracketAsHTML()}</div>
        </div>

        <!-- Button Section -->
        <div class="mt-4 space-x-4">
          <button
            id="finish-btn"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
          >
            Set as finished
          </button>
        </div>
      </div>
    `;
  }

  protected addListeners(): void {
    document
      .getElementById("finish-btn")!
      .addEventListener("click", () => this.setFinished());
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private async setFinished() {
    try {
      await setTournamentFinished(this.tournament.getId());
      router.reload();
    } catch (error) {
      router.handleError("Error setting tournament as finished", error);
    }
  }

  getName(): string {
    return "results";
  }
}
