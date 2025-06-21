import AbstractView from "./AbstractView.js";
import {
  getUserStats,
  getUserStatsByUsername
} from "../services/userStatsServices.js";
import {
  getUserByUsername,
  getUserMatches,
  getUserMatchesByUsername
} from "../services/userServices.js";
import { escapeHTML } from "../utility.js";
import { auth } from "../AuthManager.js";
import { Header1 } from "../components/Header1.js";
import { Table } from "../components/Table.js";
import { UserStatsRow } from "../components/UserStatsRow.js";
import { MatchRow, NoMatchesRow } from "../components/MatchRow.js";
import { Match } from "../types/IMatch.js";
import { router } from "../routing/Router.js";
import { getUserFriendRequestByUsername } from "../services/friendsServices.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { User } from "../types/User.js";
import { UserStats } from "../types/IUserStats.js";

export default class StatsView extends AbstractView {
  private viewType: "self" | "friend" | "public" = "public";
  private username = escapeHTML(router.getParams().username);
  private user: User | null = null;
  private friendRequest: FriendRequest | null = null;

  constructor() {
    super();
    this.setTitle("Stats");
  }

  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;

  createHTML() {
    let html;
    html = this.getUserStatsHTML();
    if (this.viewType === "self" || this.viewType === "friend") {
      html += this.getMatchesHTML();
    }
    return html;
  }

  async render() {
    await this.setViewType();
    await this.fetchData();
    this.updateHTML();
  }

  getUserStatsHTML(): string {
    if (!this.userStats) throw new Error("UserStats is null");

    const userStatsRow = UserStatsRow(this.username, this.userStats);

    return /* HTML */ ` <div
      class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8"
    >
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
        rows: [userStatsRow]
      })}
    </div>`;
  }

  getMatchesHTML(): string {
    if (!this.matches) throw new Error("Matches is null");

    const matchesRows =
      this.matches.length === 0
        ? [NoMatchesRow()]
        : this.matches.map((matchRaw: Match) =>
            MatchRow(matchRaw, this.username)
          );

    return /* HTML */ ` <div
      class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8"
    >
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
        rows: matchesRows
      })}
    </div>`;
  }

  getName(): string {
    return "stats";
  }

  async setViewType() {
    if (this.username === auth.getUser().username) {
      this.viewType = "self";
      return;
    }
    this.user = await getUserByUsername(this.username);
    if (!this.user) {
      throw Error("User not found");
    }
    this.friendRequest = await getUserFriendRequestByUsername(this.username);
    if (this.friendRequest?.status === "ACCEPTED") {
      this.viewType = "friend";
    } else {
      this.viewType = "public";
    }
  }

  async fetchData() {
    if (this.viewType === "self") {
      this.userStats = await getUserStats();
      this.matches = await getUserMatches();
      return;
    }
    this.userStats = await getUserStatsByUsername(this.username);
    if (!this.userStats) throw new Error("Could not fetch user-stats");
    if (this.viewType === "friend") {
      this.matches = await getUserMatchesByUsername(this.username);
    }
  }
}
