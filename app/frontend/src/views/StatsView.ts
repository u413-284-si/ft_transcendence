import AbstractView from "./AbstractView.js";
import { getUserStats } from "../services/userStatsServices.js";
import { getUserMatches } from "../services/userServices.js";
import { escapeHTML } from "../utility.js";
import { auth } from "../AuthManager.js";
import { Header1 } from "../components/Header1.js";
import { Table } from "../components/Table.js";
import { UserStatsRow } from "../components/UserStatsRow.js";
import { UserStats } from "../types/IUserStats.js";
import { MatchRow } from "../components/MatchRow.js";
import { Match } from "../types/IMatch.js";

export default class StatsView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Stats");
  }

  private userStatsHTML: string = "";
  private matchesHTML: string = "";

  createHTML() {
    return /* HTML */ `
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Player Statistics",
          id: "player-statistics-header",
          variant: "default"
        })}
        ${Table({
          id: "user-stats-table",
          headers: [
            "Username",
            "Total Matches",
            "Matches Won",
            "Matches Lost",
            "Win Rate"
          ],
          rows: [this.userStatsHTML]
        })}
      </div>

      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Match History",
          id: "match-history-header",
          variant: "default"
        })}
        ${Table({
          id: "match-history-table",
          headers: [
            "Player1",
            "Player1 Score",
            "Player2",
            "Player2 Score",
            "Result",
            "Date",
            "Tournament"
          ],
          rows: this.matchesHTML
            ? this.matchesHTML
                .split("</tr>")
                .filter(Boolean)
                .map((row) => row + "</tr>")
            : []
        })}
      </div>
    `;
  }

  async render() {
    this.userStatsHTML = await this.getUserStatsHTML();
    this.matchesHTML = await this.getMatchesHTML();
    this.updateHTML();
  }

  async getUserStatsHTML(): Promise<string> {
    const user: string = escapeHTML(auth.getToken().username);
    const userStatsRaw = await getUserStats();
    const userStats: UserStats = {
      matchesPlayed: userStatsRaw.matchesPlayed,
      matchesWon: userStatsRaw.matchesWon,
      matchesLost: userStatsRaw.matchesLost,
      winRate: userStatsRaw.winRate
    };

    return UserStatsRow(user, userStats);
  }

  async getMatchesHTML(): Promise<string> {
    const user = escapeHTML(auth.getToken().username);
    const matchesRaw = await getUserMatches();

    if (matchesRaw.length === 0) {
      return `<tr><td colspan="7" class="text-center text-blue-200 py-4">No matches played yet</td></tr>`;
    }

    return matchesRaw
      .map((matchRaw: Match) => MatchRow(matchRaw, user))
      .join("");
  }

  getName(): string {
    return "stats";
  }
}
