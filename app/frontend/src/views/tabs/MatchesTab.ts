import { buildMatchesScoreDiffOptions } from "../../charts/matchesScoreDiffOptions.js";
import { buildMatchesScoresLastTenDaysOptions } from "../../charts/matchesScoresLastTenDaysOptions.js";
import { buildMatchesWinLossOptions } from "../../charts/matchesWinLossOptions.js";
import { buildMatchesWinRateOptions } from "../../charts/matchesWinRateOptions.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { MatchRow, NoMatchesRow } from "../../components/MatchRow.js";
import { PaginationControls } from "../../components/PaginationControls.js";
import { Table } from "../../components/Table.js";
import { getDataOrThrow } from "../../services/api.js";
import { getUserPlayedMatchesByUsername } from "../../services/userServices.js";
import { getUserDashboardMatchesByUsername } from "../../services/userStatsServices.js";
import { DashboardMatches } from "../../types/DataSeries.js";
import { MatchRead } from "../../types/IMatch.js";
import { UserStats } from "../../types/IUserStats.js";
import { PaginatedTab } from "./PaginatedTab.js";

export class MatchesTab extends PaginatedTab<MatchRead> {
  private dashboard: DashboardMatches | null = null;
  private userStats: UserStats;
  private username: string;

  constructor(userStats: UserStats, username: string) {
    super(10, "matches-prev-btn", "matches-next-btn", "matches-page-indicator");
    this.userStats = userStats;
    this.username = username;
  }

  getHTML(): string {
    return /* HTML */ ` <div id="tab-matches" class="tab-content">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-4">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "match-dashboard-header",
          variant: "default"
        })}
        ${this.getDashboardHTML()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-4">
        ${Header1({
          text: i18next.t("statsView.details"),
          id: "match-details-header",
          variant: "default"
        })}
        <div id="match-history-table" class="p-6"></div>
        ${PaginationControls({
          prevId: "matches-prev-btn",
          nextId: "matches-next-btn",
          indicatorId: "matches-page-indicator",
          prevLabel: "<",
          nextLabel: ">"
        })}
      </div>
    </div>`;
  }

  getDashboardHTML(): string {
    const rangeMatches = i18next.t("chart.rangeLastMatches", { count: 10 });
    const rangeDays = i18next.t("chart.rangeLastDays", { count: 10 });

    return /* HTML */ `<div class="p-6 mx-auto space-y-8 min-h-screen">
      <div class="flex flex-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: "" }),
          chartId: "win-loss-chart"
        })}
        ${Chart({
          title: i18next.t("chart.progression", { range: rangeMatches }),
          chartId: "win-rate-chart"
        })}
      </div>
      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.scoreDiff", { range: rangeMatches }),
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: i18next.t("chart.scores", { range: rangeDays }),
          chartId: "scores-last-ten-chart"
        })}
      </div>
    </div>`;
  }

  protected updateTable(matches: MatchRead[]): void {
    const table = document.getElementById("match-history-table");
    if (!table) return;

    const matchesRows =
      matches.length === 0
        ? [NoMatchesRow()]
        : matches.map((matchRaw: MatchRead) =>
            MatchRow(matchRaw, this.username)
          );

    table.innerHTML = Table({
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
    });
  }

  protected async fetchPage(limit: number, offset: number) {
    return getDataOrThrow(
      await getUserPlayedMatchesByUsername(this.username, limit, offset)
    );
  }

  async init(): Promise<void> {
    this.dashboard = getDataOrThrow(
      await getUserDashboardMatchesByUsername(this.username)
    );
    this.populateMatchesCharts();
    this.isInit = true;
  }

  private populateMatchesCharts(): void {
    if (!this.dashboard) throw new Error(i18next.t("error.somethingWentWrong"));

    this.chartOptions = {
      "win-loss-chart": buildMatchesWinLossOptions(
        this.userStats.matchesWon,
        this.userStats.matchesLost,
        this.userStats.winRate
      ),
      "win-rate-chart": buildMatchesWinRateOptions(
        i18next.t("statsView.winRate"),
        this.dashboard.winrate,
        this.userStats.matchesPlayed
      ),
      "score-diff-chart": buildMatchesScoreDiffOptions(
        i18next.t("chart.scoreDiff", { range: "" }),
        this.dashboard.scoreDiff,
        this.userStats.matchesPlayed
      ),
      "scores-last-ten-chart": buildMatchesScoresLastTenDaysOptions(
        i18next.t("chart.scores", { range: "" }),
        this.dashboard.scores
      )
    };
  }
}
