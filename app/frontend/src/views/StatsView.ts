import AbstractView from "./AbstractView.js";
import {
  getUserDashboardMatches,
  getUserDashboardMatchesByUsername,
  getUserDashboardTournaments,
  getUserDashboardTournamentsByUsername,
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
import { toaster } from "../Toaster.js";
import { formatDate } from "../formatDate.js";
import { TextBox } from "../components/TextBox.js";
import { makeTournamentPlayedOptions } from "../charts/tournamentPlayedOptions.js";

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
  private rangeMatches = i18next.t("chart.rangeLastMatches", { count: 10 });
  private rangeDays = i18next.t("chart.rangeLastDays", { count: 10 });

  constructor() {
    super();
    this.setTitle(i18next.t("statsView.title"));
  }

  createHTML() {
    if (!this.user) throw new Error(i18next.t("error.userNotFound"));
    if (!this.userStats) throw new Error(i18next.t("error.userStatsNotFound"));

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
              text: i18next.t("statsView.joined", {
                date: formatDate(this.user.dateJoined)
              })
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
            }
          ])}
          ${StatFieldGroup([
            {
              value: `${this.userStats.winRate.toFixed(2)} %`,
              text: i18next.t("statsView.winRate")
            },
            {
              value: `${this.userStats.winstreakCur}`,
              text: i18next.t("statsView.winstreak")
            },
            {
              value: `${this.userStats.winstreakMax}`,
              text: i18next.t("statsView.maxStreak")
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
      return /* HTML */ ` ${TextBox({
        text: [i18next.t("statsView.friendOnly")],
        variant: "info"
      })}`;
    }
    return /* HTML */ `
      <div class="flex space-x-4 border-b border-grey mb-4">
        ${TabButton({
          text: i18next.t("statsView.matches"),
          tabId: "matches",
          isActive: true
        })}
        ${TabButton({
          text: i18next.t("statsView.tournaments"),
          tabId: "tournaments"
        })}
        ${TabButton({ text: i18next.t("statsView.friends"), tabId: "friends" })}
      </div>
      ${this.getMatchesTabHTML()} ${this.getTournamentsTabHTML()}
    `;
  }
  getMatchesTabHTML(): string {
    return /* HTML */ ` <div id="tab-matches" class="tab-content">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "match-dashboard-header",
          variant: "default"
        })}
        ${this.getMatchesDashboard()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.details"),
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
        ${Chart({
          title: i18next.t("chart.winLoss", { range: "" }),
          chartId: "win-loss-chart"
        })}
        ${Chart({
          title: i18next.t("chart.progression", { range: this.rangeMatches }),
          chartId: "winrate-chart"
        })}
      </div>

      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.scoreDiff", { range: this.rangeMatches }),
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: i18next.t("chart.scores", { range: this.rangeDays }),
          chartId: "scores-last-ten"
        })}
      </div>
    </div>`;
  }

  getMatchesTableHTML(): string {
    if (!this.matches) throw new Error(i18next.t("error.matchesNotFound"));

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

  getTournamentsTabHTML(): string {
    return /* HTML */ ` <div id="tab-tournaments" class="tab-content hidden">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "tournament-dashboard-header",
          variant: "default"
        })}
        ${this.getTournamentsDashboard()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.details"),
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
          title: i18next.t("chart.summary"),
          chartId: "tournament-summary"
        })}
        ${Chart({
          title: i18next.t("chart.played", { range: this.rangeDays }),
          chartId: "tournament-played"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: this.rangeDays }),
          chartId: "tournament-last-10-days-4"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 4 }),
          chartId: "tournament-progress-4"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: this.rangeDays }),
          chartId: "tournament-last-10-days-8"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 8 }),
          chartId: "tournament-progress-8"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: this.rangeDays }),
          chartId: "tournament-last-10-days-16"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 16 }),
          chartId: "tournament-progress-16"
        })}
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
    if (!userStatsArray[0])
      throw new Error(i18next.t("error.userStatsNotFound"));
    this.userStats = userStatsArray[0];
    if (this.viewType === "friend") {
      this.matches = getDataOrThrow(
        await getUserPlayedMatchesByUsername(this.username)
      );
      this.dashboardMatches = getDataOrThrow(
        await getUserDashboardMatchesByUsername(this.username)
      );
      this.dashboardTournaments = getDataOrThrow(
        await getUserDashboardTournamentsByUsername(this.username)
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
        this.userStats.winRate,
        [i18next.t("global.won"), i18next.t("global.lost")],
        i18next.t("statsView.winRate")
      ),
      "winrate-chart": makeWinrateOptions(
        i18next.t("statsView.winRate"),
        this.dashboardMatches.winrate,
        this.userStats.matchesPlayed
      ),
      "score-diff-chart": makeScoreDiffOptions(
        i18next.t("chart.scoreDiff", { range: "" }),
        this.dashboardMatches.scoreDiff,
        this.userStats.matchesPlayed
      ),
      "scores-last-ten": makeScoresLastTenDaysOptions(
        i18next.t("chart.scores", { range: "" }),
        this.dashboardMatches.scores
      )
    };
    this.chartOptions["tournaments"] = {
      "tournament-summary": maketournamentSummaryOptions(
        i18next.t("chart.summary"),
        this.dashboardTournaments.summary
      ),
      "tournament-played": makeTournamentPlayedOptions(
        this.dashboardTournaments.lastNDays
      ),
      "tournament-last-10-days-4": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays[4],
        4
      ),
      "tournament-progress-4": makeTournamentProgressOptions(
        this.dashboardTournaments.progress[4].reverse(),
        4
      ),
      "tournament-last-10-days-8": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays[8],
        8
      ),
      "tournament-progress-8": makeTournamentProgressOptions(
        this.dashboardTournaments.progress[8].reverse(),
        8
      ),
      "tournament-last-10-days-16": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays[16],
        16
      ),
      "tournament-progress-16": makeTournamentProgressOptions(
        this.dashboardTournaments.progress[16].reverse(),
        16
      )
    };
  }

  async initChartsForTab(tabId: string) {
    if (!this.charts[tabId]) {
      this.charts[tabId] = {};
    }

    const optionsForTab = this.chartOptions[tabId];
    if (!optionsForTab) return;

    for (const chartId in optionsForTab) {
      if (this.charts[tabId][chartId]) {
        this.charts[tabId][chartId].destroy();
      }
      try {
        this.charts[tabId][chartId] = await renderChart(
          chartId,
          optionsForTab[chartId]
        );
      } catch (error) {
        console.error(`Chart ${chartId} failed to initialize`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }
}
