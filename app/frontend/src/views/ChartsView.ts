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
        <div
          class="bg-emerald-dark/80 border border-neon-cyan rounded-lg p-6 transition-shadow duration-300 hover:shadow-neon-cyan hover:scale-[1.02]"
        >
          <h2 class="text-xl font-semibold mb-4">Wins vs Losses</h2>
          <div id="win-loss-chart" class="mt-8"></div>
        </div>

        <!-- Winrate Progression -->
        <div
          class="bg-emerald-dark/80 border border-neon-cyan rounded-lg p-6 transition-shadow duration-300 hover:shadow-neon-cyan hover:scale-[1.02]"
        >
          <h2 class="text-xl font-semibold mb-4">
            Winrate Progression (Last 10 Matches)
          </h2>
          <div id="winrate-chart"></div>
        </div>
      </div>

      <!-- Row 2: Performance -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-900 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">
            Score Differential (Last 10 Matches)
          </h2>
          <div
            id="score-diff-chart"
            class="w-full min-w-[500px] h-[300px]"
          ></div>
        </div>
        <div class="bg-gray-900 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Tournament Summary</h2>
          <div
            id="tournament-progress-chart"
            class="w-full min-w-[500px] h-[300px]"
          ></div>
        </div>
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
    this.renderTournamentProgress();
    this.renderWinStreakChart();
    this.renderWinStreakRadialChart();
    this.renderScoresLastTenDaysChart();
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

  renderTournamentProgress() {
    if (!this.tournamentProgressSeries)
      throw new Error("tournamentProgressSeries is null");

    const options = {
      chart: {
        type: "bar",
        stacked: true,
        fontFamily: "inherit",
        background: "transparent",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4
        }
      },
      colors: ["var(--color-neon-green)", "var(--color-neon-red)"],
      series: this.tournamentProgressSeries,
      xaxis: {
        type: "category",
        title: {
          text: "Tournament Size"
        },
        labels: {
          formatter: (val: number) => `${val}-Player`
        }
      },
      yaxis: {
        title: {
          text: "Number of Tournaments"
        },
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: (val: number) => `${val}`
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val: number) => `${val}`
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "var(--color-grey)"
        }
      }
    };
    const chartEl = document.querySelector("#tournament-progress-chart");
    if (!chartEl)
      throw new Error("Chart element tournament-progress-chart not found");

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

  renderScoresLastTenDaysChart() {
    if (!this.scoresLastTen) throw new Error("scoresLastTen is null");

    const options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false // hide download menu etc
        }
      },
      series: [
        {
          name: "Scores Last Ten Days",
          data: this.scoresLastTen
        }
      ],
      xaxis: {
        type: "category",
        categories: [], // will be auto-filled by your series' x values
        title: {
          text: "Date"
        },
        labels: {
          rotate: -45 // rotate date labels for better readability
        }
      },
      yaxis: {
        title: {
          text: "Score"
        },
        min: 0
      },
      dataLabels: {
        enabled: true // show values on top of bars
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "50%", // width of each bar
          distributed: false // all bars same color
        }
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value} points`
        }
      }
    };

    const chartEl = document.querySelector("#scores-last-ten");
    if (!chartEl) throw new Error("Chart element scores-last-ten not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }
}
