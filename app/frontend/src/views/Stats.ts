import AbstractView from "./AbstractView.js";
import { globalToken } from "../main.js";
import { getUserStats } from "../services/userStatsServices.js";
import { getUserMatches } from "../services/userServices.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Stats");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
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
          <tbody
            id="user-stats-body"
            class="bg-blue-700 divide-y divide-blue-500"
          >
            <!-- Player stats will be inserted here -->
          </tbody>
        </table>
      </div>

      <h1 class="text-4xl font-bold text-blue-300 mt-12 mb-8">Match History</h1>
      <div class="overflow-x-auto">
        <table
          id="matches-table"
          class="table-auto w-full border-collapse border border-blue-500 text-white divide-y divide-blue-500"
        >
          <thead class="bg-blue-800">
            <tr>
              <th class="border border-blue-500 px-4 py-2">Player1</th>
              <th class="border border-blue-500 px-4 py-2">Player1 Score</th>
              <th class="border border-blue-500 px-4 py-2">Player2</th>
              <th class="border border-blue-500 px-4 py-2">Player2 Score</th>
              <th class="border border-blue-500 px-4 py-2">Result</th>
              <th class="border border-blue-500 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody
            id="matches-table-body"
            class="bg-blue-700 divide-y divide-blue-500"
          >
            <!-- Matches will be inserted here -->
          </tbody>
        </table>
      </div>
      ${footerHTML}
    `;
  }

  async render() {
    await this.updateHTML();
    await this.fetchAndDisplayMatches();
    await this.fetchAndDisplayUserStats();
  }

  async fetchAndDisplayMatches() {
    try {
      const matches = await getUserMatches();

      if (matches.length === 0) {
        document
          .getElementById("matches-table")
          ?.replaceWith("No matches played yet");
        return;
      }

      const matchesTableBody = document.getElementById("matches-table-body");
      if (!matchesTableBody) return;

      const activeUserId = globalToken?.id;

      matches.forEach((match) => {
        console.log("activeUserId:", activeUserId);
        console.log("match.player1Id:", match.player1Id);
        console.log("match.player2Id:", match.player2Id);
        const isPlayer1ActiveUser = match.player1Id === activeUserId;
        const isPlayer2ActiveUser = match.player2Id === activeUserId;

        let result = "-";
        if (isPlayer1ActiveUser) {
          result = match.player1Score > match.player2Score ? "Won" : "Lost";
        } else if (isPlayer2ActiveUser) {
          result = match.player2Score > match.player1Score ? "Won" : "Lost";
        }

        const player1Display = isPlayer1ActiveUser
          ? `${match.player1Nickname} (You)`
          : match.player1Nickname;
        const player2Display = isPlayer2ActiveUser
          ? `${match.player2Nickname} (You)`
          : match.player2Nickname;

        const row = document.createElement("tr");
        row.innerHTML = /* HTML */ `
          <td class="border border-blue-500 px-4 py-2">${player1Display}</td>
          <td class="border border-blue-500 px-4 py-2">
            ${match.player1Score}
          </td>
          <td class="border border-blue-500 px-4 py-2">${player2Display}</td>
          <td class="border border-blue-500 px-4 py-2">
            ${match.player2Score}
          </td>
          <td class="border border-blue-500 px-4 py-2">${result}</td>
          <td class="border border-blue-500 px-4 py-2">
            ${new Date(match.date!).toLocaleString()}
          </td>
        `;
        matchesTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching match data:", error);
    }
  }

  async fetchAndDisplayUserStats() {
    const user: string = globalToken?.username ?? "undefined";
    try {
      const userStats = await getUserStats();

      const tableBody = document.getElementById("user-stats-body");
      if (!tableBody) return;

      const formattedWinRate = userStats.winRate.toFixed(2) + "%";

      tableBody.innerHTML = /* HTML */ `
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
    } catch (error) {
      console.error("Error fetching userStats:", error);
    }
  }
}
