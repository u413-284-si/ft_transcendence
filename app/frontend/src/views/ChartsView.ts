import {
  getUserScoreDiff,
  getUserScoresLastTen,
  getUserStats,
  getUserTournamentProgress,
  getUserWinrateProgression,
} from "../services/userStatsServices.js";
import {
  ScoreDiffSeries,
  ScoresLastTenDaysSeries,
  TournamentProgressSeries,
  WinrateSeries,
} from "../types/DataSeries.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";
import { makeChartOptions, renderChart } from "../charts/utils.js";
import { makeWinrateOptions } from "../charts/winrateOptions.js";
import { makeScoreDiffOptions } from "../charts/scoreDiffOptions.js";
import { tournamentProgressOptions } from "../charts/tournamentProgressOptions.js";
import { makeScoresLastTenDaysOptions } from "../charts/scoresLastTenDaysOptions.js";
import { Chart } from "../components/Chart.js";
import { makeWinLossOptions } from "../charts/winLossOptions.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;
  private winrateSeries: WinrateSeries = [];
  private scoreDiffSeries: ScoreDiffSeries = [];
  private tournamentProgressSeries: TournamentProgressSeries | null = null;
  private scoresLastTen: ScoresLastTenDaysSeries | null = null;

  constructor() {
    super();
    this.setTitle("Charts");
  }

  createHTML() {
    return /* HTML */ ` <div class="p-6 mx-auto space-y-8 min-h-screen">
      <!-- Row 1: Summary -->
      <div class="flex flex-cols-2 gap-8">
        <!-- Wins vs Losses (small donut) -->
        ${Chart({ title: "Wins vs Losses", chartId: "win-loss-chart" })}

        <!-- Winrate Progression -->
        ${Chart({
          title: "Winrate Progression (Last 10 Matches)",
          chartId: "winrate-chart"
        })}
      </div>

      <!-- Row 2: Performance -->
      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: "Score Differential (Last 10 Matches)",
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: "Scores Last Ten Days",
          chartId: "scores-last-ten"
        })}
      </div>

      ${Chart({
        title: "Tournament Summary",
        chartId: "tournament-progress-chart"
      })}
      ${Chart({ title: "Win Streak Radial", chartId: "streak-chart" })}
    </div>`;
  }

  async render() {
    this.userStats = await getUserStats();
    this.winrateSeries = await getUserWinrateProgression();
    this.tournamentProgressSeries = await getUserTournamentProgress();
    this.scoreDiffSeries = await getUserScoreDiff();
    this.scoresLastTen = await getUserScoresLastTen();
    this.updateHTML();
    const winLossChart = renderChart(
      "win-loss-chart",
      makeWinLossOptions(
        this.userStats.matchesWon,
        this.userStats.matchesLost,
        this.userStats.winRate
      )
    );
    const winrateChart = renderChart(
      "winrate-chart",
      makeWinrateOptions(
        "Winrate",
        this.winrateSeries,
        this.userStats.matchesPlayed
      )
    );
    const scoreDiffChart = renderChart(
      "score-diff-chart",
      makeScoreDiffOptions(
        "Score Difference",
        this.scoreDiffSeries,
        this.userStats.matchesPlayed
      )
    );
    const tournamentProgressChart = renderChart(
      "tournament-progress-chart",
      makeChartOptions(tournamentProgressOptions, this.tournamentProgressSeries)
    );
    const scoresLastTenDaysChart = renderChart(
      "scores-last-ten",
      makeScoresLastTenDaysOptions("Scores Last Ten Days", this.scoresLastTen)
    );
  }

  getName(): string {
    return "charts";
  }

}
