import AbstractView from "./AbstractView.js";
import { getUserStats } from "../services/userStatsServices.js";
import { getUserMatches } from "../services/userServices.js";
import { escapeHTML } from "../utility.js";
import { auth } from "../AuthManager.js";

export default class StatsView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Stats");
  }

  private userStatsHTML: string = "";
  private matchesHTML: string = "";

  createHTML() {
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();

    return /* HTML */ `
      ${navbarHTML}
      <h1 class="text-4xl font-bold text-blue-300 mb-8">Player Statistics</h1>
      <div class="overflow-x-auto">
        <table
          class="table-auto w-full border-collapse border border-blue-500 text-white divide-y divide-blue-500"
        >
          <thead class="bg-blue-800">
            <tr>
              <th class="border border-blue-500 px-4 py-2">Username</th>
              <th class="border border-blue-500 px-4 py-2">Total Matches</th>
              <th class="border border-blue-500 px-4 py-2">Matches Won</th>
              <th class="border border-blue-500 px-4 py-2">Matches Lost</th>
              <th class="border border-blue-500 px-4 py-2">Win Rate</th>
            </tr>
          </thead>
          <tbody class="bg-blue-700 divide-y divide-blue-500">
            ${this.userStatsHTML}
          </tbody>
        </table>
      </div>

      <h1 class="text-4xl font-bold text-blue-300 mt-12 mb-8">Match History</h1>
      <div class="overflow-x-auto">
        <table
          class="table-auto w-full border-collapse border border-blue-500 text-white divide-y divide-blue-500"
        >
          <thead class="bg-blue-800">
            <tr>
              <th class="border border-blue-500 px-4 py-2">Nickname</th>
              <th class="border border-blue-500 px-4 py-2">Score</th>
              <th class="border border-blue-500 px-4 py-2">Opponent</th>
              <th class="border border-blue-500 px-4 py-2">Opponent Score</th>
              <th class="border border-blue-500 px-4 py-2">Result</th>
              <th class="border border-blue-500 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody class="bg-blue-700 divide-y divide-blue-500">
            ${this.matchesHTML}
          </tbody>
        </table>
      </div>
      ${footerHTML}
    `;
  }

  async render() {
    try {
      this.userStatsHTML = await this.getUserStatsHTML();
      this.matchesHTML = await this.getMatchesHTML();
      this.updateHTML();
    } catch (error) {
      console.error(error);
      // FIXME: show error page
    }
  }

  async getUserStatsHTML(): Promise<string> {
    const user: string = escapeHTML(auth.getToken().username);
    const userStats = await getUserStats();
    const formattedWinRate = userStats.winRate.toFixed(2) + "%";

    return /* HTML */ `
      <tr>
        <td class="border border-blue-500 px-4 py-2">${user}</td>
        <td class="border border-blue-500 px-4 py-2">
          ${userStats.matchesPlayed}
        </td>
        <td class="border border-blue-500 px-4 py-2">
          ${userStats.matchesWon}
        </td>
        <td class="border border-blue-500 px-4 py-2">
          ${userStats.matchesLost}
        </td>
        <td class="border border-blue-500 px-4 py-2">${formattedWinRate}</td>
      </tr>
    `;
  }

  async getMatchesHTML(): Promise<string> {
    const matches = await getUserMatches();

    if (matches.length === 0) {
      return `<tr><td colspan="6" class="text-center text-blue-200 py-4">No matches played yet</td></tr>`;
    }

    return matches
      .map((match) => {
        const result = match.playerScore > match.opponentScore ? "Won" : "Lost";
        return /* HTML */ `
          <tr>
            <td class="border border-blue-500 px-4 py-2">
              ${escapeHTML(match.playerNickname)}
            </td>
            <td class="border border-blue-500 px-4 py-2">
              ${match.playerScore}
            </td>
            <td class="border border-blue-500 px-4 py-2">
              ${escapeHTML(match.opponentNickname)}
            </td>
            <td class="border border-blue-500 px-4 py-2">
              ${match.opponentScore}
            </td>
            <td class="border border-blue-500 px-4 py-2">${result}</td>
            <td class="border border-blue-500 px-4 py-2">
              ${new Date(match.date!).toLocaleString()}
            </td>
          </tr>
        `;
      })
      .join("");
  }

  getName(): string {
    return "stats";
  }
}
