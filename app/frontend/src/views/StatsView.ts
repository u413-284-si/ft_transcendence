import AbstractView from "./AbstractView.js";
import {
  getUserDashboardMatches,
  getUserDashboardTournaments,
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
import { TabButton } from "../components/TabButton.js";
import { Chart } from "../components/Chart.js";
import { DashboardMatches, DashboardTournaments } from "../types/DataSeries.js";
import { makeWinLossOptions } from "../charts/winLossOptions.js";
import { makeWinrateOptions } from "../charts/winrateOptions.js";
import { makeScoreDiffOptions } from "../charts/scoreDiffOptions.js";
import { makeScoresLastTenDaysOptions } from "../charts/scoresLastTenDaysOptions.js";
import { renderChart } from "../charts/utils.js";
import { maketournamentSummaryOptions } from "../charts/tournamentSummaryOptions.js";
import { makeTournamentProgressOptions } from "../charts/tournamentProgressOptions.js";
import { maketournamentLastNDaysOptions } from "../charts/tournamentsLastNDaysOptions.js";

export default class StatsView extends AbstractView {
  private viewType: "self" | "friend" | "public" = "public";
  private username = escapeHTML(router.getParams().username);
  private user: User | null = null;
  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;
  private friendRequest: FriendRequest | null = null;
  private dashboardMatches: DashboardMatches | null = null;
  private dashboardTournaments: DashboardTournaments | null = null;
  private charts: Record<string, Record<string, ApexCharts>> = {};
  private chartOptions: Record<string, Record<string, ApexCharts.ApexOptions>> =
    {};

  constructor() {
    super();
    this.setTitle("Stats");
  }

  createHTML() {
    if (!this.userStats) throw new Error("User stats is null");

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
            { value: `${this.userStats.matchesPlayed}`, text: "Played" },
            { value: `${this.userStats.matchesWon}`, text: "Won" },
            { value: `${this.userStats.matchesLost}`, text: "Lost" }
          ])}
          ${StatFieldGroup([
            {
              value: `${this.userStats.winRate.toFixed(2)} %`,
              text: "Win Rate"
            },
            {
              value: `${this.userStats.winstreakCur}`,
              text: "Winstreak"
            },
            {
              value: `${this.userStats.winstreakMax}`,
              text: "Max Streak"
            }
          ])}
        </div>
      </div>

      ${this.getTabsHTML()} `;
  }

  async render() {
    await this.setViewType();
    await this.fetchData();
    this.updateHTML();
    if (this.viewType === "public") return;
    this.addListeners();
    this.populateChartOptions();
    this.initChartsForTab("matches");
  }

  getTabsHTML(): string {
    if (this.viewType === "public") {
      return /* HTML */ ` ${Paragraph({
        text: "You need to be friends to view detailed stats"
      })}`;
    }
    return /* HTML */ `
      <div class="flex space-x-4 border-b border-gray-300 mb-4">
        ${TabButton({ text: "Matches", tabId: "matches", isActive: true })}
        ${TabButton({ text: "Tournament", tabId: "tournaments" })}
        ${TabButton({ text: "Friends", tabId: "friends" })}
      </div>
      ${this.getMatchesTabHTML()} ${this.getTournamentsTabHTML()}
    `;
  }
  getMatchesTabHTML(): string {
    return /* HTML */ ` <div id="tab-matches" class="tab-content">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Dashboard",
          id: "match-dashboard-header",
          variant: "default"
        })}
        ${this.getMatchesDashboard()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Details",
          id: "match-details-header",
          variant: "default"
        })}
        ${this.getMatchesTableHTML()}
      </div>
    </div>`;
  }

  getMatchesDashboard(): string {
    return /* HTML */ `<div class="p-6 mx-auto space-y-8 min-h-screen">
      <div class="flex flex-cols-2 gap-8">
        ${Chart({ title: "Wins vs Losses", chartId: "win-loss-chart" })}
        ${Chart({
          title: "Winrate Progression (Last 10 Matches)",
          chartId: "winrate-chart"
        })}
      </div>

      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: "Score Difference (Last 10 Matches)",
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: "Scores Last Ten Days",
          chartId: "scores-last-ten"
        })}
      </div>
    </div>`;
  }

  getMatchesTableHTML(): string {
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

  getTournamentsTabHTML(): string {
    return /* HTML */ ` <div id="tab-tournaments" class="tab-content hidden">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Dashboard",
          id: "tournament-dashboard-header",
          variant: "default"
        })}
        ${this.getTournamentsDashboard()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: "Details",
          id: "tournament-details-header",
          variant: "default"
        })}
        ${this.getTournamentsTableHTML()}
      </div>
    </div>`;
  }

  getTournamentsDashboard(): string {
    return /* HTML */ `<div class="p-6 mx-auto space-y-8">
      <div class="flex gap-8">
        ${Chart({
          title: "Tournament Summary",
          chartId: "tournament-summary"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: "Tournament Progress 4",
          chartId: "tournament-progress-4"
        })}
        ${Chart({
          title: "Tournament Progress 8",
          chartId: "tournament-progress-8"
        })}
        ${Chart({
          title: "Tournament Progress 16",
          chartId: "tournament-progress-16"
        })}
      </div>
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          ${Chart({
            title: "Tournaments Last 10 Days",
            chartId: "tournament-last-10-days"
          })}
        </div>
      </div>
    </div>`;
  }

  getTournamentsTableHTML(): string {
    return /* HTML */ ``;
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
      throw Error("User not found");
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
      this.dashboardMatches = getDataOrThrow(await getUserDashboardMatches());
      this.dashboardTournaments = getDataOrThrow(
        await getUserDashboardTournaments()
      );
      this.userStats = getDataOrThrow(await getUserStats());
      this.matches = getDataOrThrow(await getUserPlayedMatches());
      return;
    }
    const userStatsArray = getDataOrThrow(
      await getUserStatsByUsername(this.username)
    );
    if (!userStatsArray[0]) throw new Error("Could not fetch user-stats");
    this.userStats = userStatsArray[0];
    if (this.viewType === "friend") {
      this.matches = getDataOrThrow(
        await getUserPlayedMatchesByUsername(this.username)
      );
    }
  }

  protected addListeners(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".tab-button");
    const contents = document.querySelectorAll<HTMLDivElement>(".tab-content");

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const tabId = button.dataset.tab!;

        contents.forEach((content) => {
          content.classList.add("hidden");
        });

        buttons.forEach((btn) => {
          btn.classList.remove("active-link");
        });

        const targetContent = document.getElementById(`tab-${tabId}`);
        if (targetContent) targetContent.classList.remove("hidden");

        button.classList.add("active-link");

        requestAnimationFrame(() => {
          this.initChartsForTab(tabId);
        });
      });
    });
  }

  populateChartOptions(): void {
    if (!this.dashboardMatches) throw new Error("Dashboard matches is null");
    if (!this.dashboardTournaments)
      throw new Error("Tournament matches is null");
    if (!this.userStats) throw new Error("User stats is null");

    this.chartOptions["matches"] = {
      "win-loss-chart": makeWinLossOptions(
        this.userStats.matchesWon,
        this.userStats.matchesLost,
        this.userStats.winRate
      ),
      "winrate-chart": makeWinrateOptions(
        "Winrate",
        this.dashboardMatches.winrate,
        this.userStats.matchesPlayed
      ),
      "score-diff-chart": makeScoreDiffOptions(
        "Score Difference",
        this.dashboardMatches.scoreDiff,
        this.userStats.matchesPlayed
      ),
      "scores-last-ten": makeScoresLastTenDaysOptions(
        "Scores Last Ten Days",
        this.dashboardMatches.scores
      )
    };
    this.chartOptions["tournaments"] = {
      "tournament-summary": maketournamentSummaryOptions(
        this.dashboardTournaments.summary
      ),
      "tournament-progress-4": makeTournamentProgressOptions(
        "How often reached",
        this.dashboardTournaments.progress["4"].reverse()
      ),
      "tournament-progress-8": makeTournamentProgressOptions(
        "Tournament Progress 8",
        this.dashboardTournaments.progress["8"].reverse()
      ),
      "tournament-progress-16": makeTournamentProgressOptions(
        "Tournament Progress 16",
        this.dashboardTournaments.progress["16"].reverse()
      ),
      "tournament-last-10-days": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays
      )
    };
  }

  initChartsForTab(tabId: string) {
    if (!this.charts[tabId]) this.charts[tabId] = {};

    const optionsForTab = this.chartOptions[tabId];
    if (!optionsForTab) return;

    for (const chartId in optionsForTab) {
      if (this.charts[tabId][chartId]) {
        this.charts[tabId][chartId].destroy();
      }
      this.charts[tabId][chartId] = renderChart(
        chartId,
        optionsForTab[chartId]
      );
    }
  }
}
