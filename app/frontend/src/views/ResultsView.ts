import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";

export default class ResultsView extends AbstractView {
  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Results");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <!-- Header Section -->
        <div
          class="bg-indigo-50 border-l-4 border-indigo-400 rounded-2xl shadow p-6 text-center"
        >
          <h1 class="text-4xl font-extrabold text-blue-700">
            🎉 Tournament Results 🎉
          </h1>
          <p class="text-xl text-gray-700 mt-2">
            Name: ${this.tournament.getTournamentName()}
          </p>
        </div>

        <!-- Winner Section -->
        <div
          class="bg-yellow-50 border border-yellow-300 rounded-2xl shadow p-6 text-center space-y-4"
        >
          <h2 class="text-3xl font-extrabold text-yellow-700">Champion</h2>
          <p class="text-2xl font-bold text-gray-800">
            🏆 ${this.tournament.getTournamentWinner()} 🏆
          </p>
          <p class="text-xl text-gray-600">Congratulations on the victory!</p>
        </div>

        <!-- Bracket Section -->
        <div class="bg-white rounded-2xl shadow p-6 text-center space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">Tournament Bracket</h2>
          <div class="mb-6">${this.tournament.getBracketAsHTML()}</div>
        </div>
      </div>
      ${footerHTML}
    `;
  }

  async render() {
    await this.updateHTML();
  }
}
