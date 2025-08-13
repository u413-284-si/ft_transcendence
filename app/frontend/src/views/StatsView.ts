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
import { getDataOrThrow } from "../services/api.js";
import { formatDate } from "../formatDate.js";

export default class StatsView extends AbstractView {
  private viewType: "self" | "friend" | "public" = "public";
  private username = escapeHTML(router.getParams().username);
  private user: User | null = null;
  private friendRequest: FriendRequest | null = null;

  constructor() {
    super();
    this.setTitle(i18next.t("statsView.title"));
  }

  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;

  createHTML() {
    if (!this.user) throw new Error(i18next.t("error.somethingWentWrong"));
    if (!this.userStats) throw new Error(i18next.t("error.somethingWentWrong"));

    return /* HTML */ `<div
        class="flex flex-row items-center gap-y-6 gap-x-8 mb-12 pl-6"
      >
        <img
          src=${this.user.avatar || "/images/default-avatar.png"}
          alt=${i18next.t("global.avatar")}
          class="w-20 h-20 rounded-full border-2 border-neon-cyan shadow-neon-cyan"
        />
        <div class="flex flex-col md:flex-row md:items-center md:gap-x-8">
          <div>
            ${Header1({
              text: escapeHTML(this.username),
              variant: "username"
            })}
            ${Paragraph({
              text: `${i18next.t("statsView.joined", {
                date: formatDate(this.user.dateJoined)
              })}`
            })}
          </div>

          ${StatFieldGroup([
            {
              value: `${this.userStats.matchesPlayed}`,
              text: i18next.t("statsView.played")
            },
            {
              value: `${this.userStats.matchesWon}`,
              text: i18next.t("global.won")
            },
            {
              value: `${this.userStats.matchesLost}`,
              text: i18next.t("global.lost")
            },
            {
              value: `${this.userStats.winRate.toFixed(2)} %`,
              text: i18next.t("statsView.winRate")
            },
            {
              value: `${this.userStats?.winstreakCur}`,
              text: i18next.t("statsView.winstreakCur")
            },
            {
              value: `${this.userStats?.winstreakMax}`,
              text: i18next.t("statsView.winstreakMax")
            }
          ])}
        </div>
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.matchHistory"),
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
        text: i18next.t("statsView.friendOnly")
      })}`;
    }

    if (!this.matches) throw new Error(i18next.t("error.nullMatches"));

    const matchesRows =
      this.matches.length === 0
        ? [NoMatchesRow()]
        : this.matches.map((matchRaw: Match) =>
            MatchRow(matchRaw, this.username)
          );

    return /* HTML */ `${Table({
      id: "match-history-table",
      headers: [
        i18next.t("statsView.player1"),
        i18next.t("statsView.player1Score"),
        i18next.t("statsView.player2"),
        i18next.t("statsView.player2Score"),
        i18next.t("statsView.result"),
        i18next.t("statsView.date"),
        i18next.t("statsView.tournament")
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
    this.user = getDataOrThrow(await getUserByUsername(this.username));
    if (!this.user) {
      throw new Error(i18next.t("global.userNotFound"));
    }
    const requests = getDataOrThrow(
      await getUserFriendRequestByUsername(this.username)
    );
    if (!requests[0]) return;
    this.friendRequest = requests[0];
    if (this.friendRequest.status === "ACCEPTED") {
      this.viewType = "friend";
    } else {
      this.viewType = "public";
    }
  }

  async fetchData() {
    if (this.viewType === "self") {
      this.userStats = getDataOrThrow(await getUserStats());
      this.matches = getDataOrThrow(await getUserPlayedMatches());
      return;
    }
    const userStatsArray = getDataOrThrow(
      await getUserStatsByUsername(this.username)
    );
    if (!userStatsArray[0])
      throw new Error(i18next.t("error.userStatsNotFound"));
    this.userStats = userStatsArray[0];
    if (this.viewType === "friend") {
      this.matches = getDataOrThrow(
        await getUserPlayedMatchesByUsername(this.username)
      );
    }
  }
}
