import { makeScoreDiffOptions } from "../../charts/scoreDiffOptions.js";
import { makeScoresLastTenDaysOptions } from "../../charts/scoresLastTenDaysOptions.js";
import { renderChart } from "../../charts/utils.js";
import { makeWinLossOptions } from "../../charts/winLossOptions.js";
import { makeWinrateOptions } from "../../charts/winrateOptions.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { MatchRow, NoMatchesRow } from "../../components/MatchRow.js";
import { Table } from "../../components/Table.js";
import { toaster } from "../../Toaster.js";
import { DashboardMatches } from "../../types/DataSeries.js";
import { Match } from "../../types/IMatch.js";
import { UserStats } from "../../types/IUserStats.js";
import { AbstractTab } from "./AbstractTab.js";

export class MatchesTab extends AbstractTab {
  private matches: Match[];
  private dashboard: DashboardMatches;
  private userStats: UserStats;
  private username: string;

  constructor(
    matches: Match[],
    dashboard: DashboardMatches,
    userStats: UserStats,
    username: string
  ) {
    super();
    this.matches = matches;
    this.dashboard = dashboard;
    this.userStats = userStats;
    this.username = username;
    this.populateMatchesCharts();
  }

  getHTML(): string {
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
          chartId: "winrate-chart"
        })}
      </div>

      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.scoreDiff", { range: rangeMatches }),
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: i18next.t("chart.scores", { range: rangeDays }),
          chartId: "scores-last-ten"
        })}
      </div>
    </div>`;
  }

  getMatchesTableHTML(): string {
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

  async onShow(): Promise<void> {
    for (const chartId in this.chartOptions) {
      try {
        this.charts[chartId] = await renderChart(
          chartId,
          this.chartOptions[chartId]
        );
      } catch (error) {
        console.error(`Chart ${chartId} failed to initialize`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }

  private populateMatchesCharts(): void {
    this.chartOptions = {
      "win-loss-chart": makeWinLossOptions(
        this.userStats.matchesWon,
        this.userStats.matchesLost,
        this.userStats.winRate
      ),
      "winrate-chart": makeWinrateOptions(
        i18next.t("statsView.winRate"),
        this.dashboard.winrate,
        this.userStats.matchesPlayed
      ),
      "score-diff-chart": makeScoreDiffOptions(
        i18next.t("chart.scoreDiff", { range: "" }),
        this.dashboard.scoreDiff,
        this.userStats.matchesPlayed
      ),
      "scores-last-ten": makeScoresLastTenDaysOptions(
        i18next.t("chart.scores", { range: "" }),
        this.dashboard.scores
      )
    };
  }
}
