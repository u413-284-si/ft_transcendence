import AbstractView from "./AbstractView.js";
import {
  getUserStats,
  getUserStatsByUsername
} from "../services/userStatsServices.js";
import {
  getUserByUsername,
  getUserPlayedMatches,
  getUserPlayedMatchesByUsername
} from "../services/userServices.js";
import { escapeHTML } from "../utility.js";
import { auth } from "../AuthManager.js";
import { Header1 } from "../components/Header1.js";
import { Table } from "../components/Table.js";
import { MatchRow, NoMatchesRow } from "../components/MatchRow.js";
import { Match } from "../types/IMatch.js";
import { router } from "../routing/Router.js";
import { getUserFriendRequestByUsername } from "../services/friendsServices.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { User } from "../types/User.js";
import { UserStats } from "../types/IUserStats.js";
import { Paragraph } from "../components/Paragraph.js";
import { StatFieldGroup } from "../components/StatField.js";

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
    return /* HTML */ `<div
        class="flex flex-row items-center gap-y-6 gap-x-8 mb-12 pl-6"
      >
        <img
          src=${this.user?.avatar || "/images/default-avatar.png"}
          alt="Avatar"
          class="w-20 h-20 rounded-full border-2 border-neon-cyan shadow-neon-cyan"
        />
        <div class="flex flex-col md:flex-row md:items-center md:gap-x-8">
          <div>
            ${Header1({
              text: this.username,
              variant: "username"
            })}
            ${Paragraph({
              text: `Joined: ${this.user?.dateJoined.slice(0, 10)}`
            })}
          </div>

          ${StatFieldGroup([
            { value: `${this.userStats?.matchesPlayed}`, text: "Played" },
            { value: `${this.userStats?.matchesWon}`, text: "Won" },
            { value: `${this.userStats?.matchesLost}`, text: "Lost" },
            {
              value: `${this.userStats?.winRate.toFixed(2)} %`,
              text: "Win Rate"
            }
          ])}
        </div>
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Match History",
          id: "match-history-header",
          variant: "default"
        })}
        ${this.getMatchesHTML()}
      </div> `;
  }

  async render() {
    await this.setViewType();
    await this.fetchData();
    this.updateHTML();
  }

  getMatchesHTML(): string {
    if (this.viewType === "public") {
      return /* HTML */ ` ${Paragraph({
        text: "You need to be friends to view Match History"
      })}`;
    }

    if (!this.matches) throw new Error("Matches is null");

    const matchesRows =
      this.matches.length === 0
        ? [NoMatchesRow()]
        : this.matches.map((matchRaw: Match) =>
            MatchRow(matchRaw, this.username)
          );

    return /* HTML */ `${Table({
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
    })}`;
  }

  getName(): string {
    return "stats";
  }

  async setViewType() {
    if (this.username === auth.getUser().username) {
      this.viewType = "self";
      this.user = auth.getUser();
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
      this.matches = await getUserPlayedMatches();
      return;
    }
    this.userStats = await getUserStatsByUsername(this.username);
    if (!this.userStats) throw new Error("Could not fetch user-stats");
    if (this.viewType === "friend") {
      this.matches = await getUserPlayedMatchesByUsername(this.username);
    }
  }
}
