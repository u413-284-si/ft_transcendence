import type { ApexOptions } from "apexcharts";
import {
  getUserActivityMatrix,
  getUserScoreDiff,
  getUserScoresLastTen,
  getUserStats,
  getUserTournamentProgress,
  getUserWinrateProgression,
  getUserWinStreak
} from "../services/userStatsServices.js";
import {
  HeatmapSeries,
  ScoreDiffSeries,
  ScoresLastTenDaysSeries,
  TournamentProgressSeries,
  WinrateSeries,
  WinStreakStats
} from "../types/DataSeries.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";
import { makeChartOptions, renderChart } from "../charts/utils.js";
import { winrateOptions } from "../charts/winrateOptions.js";
import { scoreDiffOptions } from "../charts/scoreDiffOptions.js";
import { tournamentProgressOptions } from "../charts/tournamentProgressOptions.js";
import { scoresLastTenDaysOptions } from "../charts/scoresLastTenDaysOptions.js";
import { Chart } from "../components/Chart.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;
  private winrateSeries: WinrateSeries = [];
  private scoreDiffSeries: ScoreDiffSeries | null = null;
  private activityMatrix: HeatmapSeries | null = null;
  private tournamentProgressSeries: TournamentProgressSeries | null = null;
  private winStreak: WinStreakStats | null = null;
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
          title: "Tournament Summary",
          chartId: "tournament-progress-chart"
        })}
      </div>

      <!-- Row 3: Heatmap -->
      <div class="bg-gray-900 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Activity Heatmap</h2>
        <div
          id="activity-heatmap-chart"
          class="w-full min-w-[500px] h-[300px]"
        ></div>
      </div>

      <!-- Row 4: Win Streak -->
      <div class="bg-gray-900 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Win Streak</h2>
        <div id="win-streak-chart" class="w-full min-w-[500px] h-[300px]"></div>
      </div>

      <!-- Row 5: Another Win Streak -->
      <div class="bg-gray-900 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Win Streak Radial</h2>
        <div id="streak-chart" class="w-full min-w-[500px] h-[300px]"></div>
      </div>

      <!-- Row 5: Scores Last Ten Days -->
      <div class="bg-gray-900 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Scores Last Ten Days</h2>
        <div id="scores-last-ten" class="w-full min-w-[500px] h-[300px]"></div>
      </div>
    </div>`;
  }

  async render() {
    this.userStats = await getUserStats();
    this.winrateSeries = await getUserWinrateProgression();
    this.activityMatrix = await getUserActivityMatrix();
    this.tournamentProgressSeries = await getUserTournamentProgress();
    this.scoreDiffSeries = (await getUserScoreDiff()).map((point) => ({
      x: new Date(point.x).toLocaleDateString(),
      y: point.y
    }));
    this.winStreak = await getUserWinStreak();
    this.scoresLastTen = await getUserScoresLastTen();
    this.updateHTML();
    this.rederWinLossChart(this.userStats);
    const winrateChart = renderChart(
      "winrate-chart",
      makeChartOptions(winrateOptions, "Winrate", this.winrateSeries)
    );
    const scoreDiffChart = renderChart(
      "score-diff-chart",
      makeChartOptions(
        scoreDiffOptions,
        "Score Differential",
        this.scoreDiffSeries
      )
    );
    this.renderActivityHeatMap();
    const tournamentProgressChart = renderChart(
      "tournament-progress-chart",
      makeChartOptions(tournamentProgressOptions, this.tournamentProgressSeries)
    );
    this.renderWinStreakChart();
    this.renderWinStreakRadialChart();
    const scoresLastTenDaysChart = renderChart(
      "scores-last-ten",
      makeChartOptions(
        scoresLastTenDaysOptions,
        "Scores Last Ten Days",
        this.scoresLastTen
      )
    );
  }

  getName(): string {
    return "charts";
  }

  rederWinLossChart(stats: UserStats) {
    const options = {
      chart: {
        type: "donut",
        fontFamily: "inherit",
        background: "transparent",
        width: 450,
        height: 300
      },
      labels: ["Wins", "Losses"],
      series: [stats.matchesWon, stats.matchesLost],
      colors: ["var(--color-neon-cyan)", "var(--color-neon-red)"],
      legend: {
        position: "bottom",
        labels: {
          colors: ["var(--color-grey)", "var(--color-grey)"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["var(--color-grey)"]
      },
      plotOptions: {
        pie: {
          donut: {
            size: "50%",
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: -10,
                color: "var(--color-grey)",
                fontSize: "10px"
              },
              total: {
                show: true,
                label: "Win Rate",
                color: "var(--color-grey)",
                fontSize: "10px",
                formatter: function () {
                  return `${stats.winRate.toFixed(1)}%`;
                }
              }
            }
          }
        }
      }
    };

    const chartEl = document.querySelector("#win-loss-chart");
    if (!chartEl) throw new Error("win-loss-chart element not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }

  renderActivityHeatMap() {
    const options = {
      chart: {
        type: "heatmap",
        height: 350,
        fontFamily: "inherit",
        background: "transparent"
      },
      series: this.activityMatrix,
      dataLabels: {
        enabled: false
      },
      colors: ["#0094a1"],
      xaxis: {
        title: { text: "Hour of Day" }
      },
      yaxis: {
        title: { text: "Day of Week" }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val: number) => `${val} match${val !== 1 ? "es" : ""}`
        }
      }
    };

    const chartEl = document.querySelector("#activity-heatmap-chart");
    if (!chartEl)
      throw new Error("Chart element activity-heatmap-chart not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }

  renderWinStreakChart() {
    if (!this.winStreak) throw new Error("winStreak is null");

    const options = {
      chart: {
        type: "line",
        height: 300
      },
      series: [
        {
          name: "Win Streak",
          data: this.winStreak.data
        }
      ],
      xaxis: {
        title: { text: "Date" },
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm"
          }
        }
      },
      yaxis: {
        title: { text: "Win Streak" },
        min: 0,
        stepSize: 1
      },
      stroke: {
        curve: "stepline"
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd MMM yyyy HH:mm"
        },
        y: {
          formatter: (val: number) =>
            `${val} win${val === 1 ? "" : "s"} in a row`
        }
      }
    };

    const chartEl = document.querySelector("#win-streak-chart");
    if (!chartEl) throw new Error("Chart element win-streak-chart not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }

  renderWinStreakRadialChart() {
    if (!this.winStreak) throw new Error("winStreak is null");

    const current = this.winStreak.currentStreak;
    const max = this.winStreak.maxStreak;
    const percent = max > 0 ? (current / max) * 100 : 0;
    const options = {
      chart: {
        type: "radialBar",
        height: 350
      },
      series: [percent], // e.g., 57.14 (if current = 4, max = 7)
      plotOptions: {
        radialBar: {
          hollow: {
            size: "60%"
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: "18px",
              offsetY: -10,
              color: "#666",
              text: "Current Streak"
            },
            value: {
              formatter: () => `${current}/${max}`,
              fontSize: "22px",
              show: true
            }
          }
        }
      },
      labels: ["Win Streak"]
    };

    const chartEl = document.querySelector("#streak-chart");
    if (!chartEl) throw new Error("Chart element streak-chart not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }
}
