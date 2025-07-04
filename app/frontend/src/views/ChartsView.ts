import { getUserMatches } from "../services/userServices.js";
import {
  getUserActivityMatrix,
  getUserStats,
  getUserTournamentProgress,
  getUserWinrateProgression
} from "../services/userStatsServices.js";
import { WinrateProgression } from "../types/DataSeries.js";
import type { Match } from "../types/IMatch.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;
  private winrateProgression: WinrateProgression | null = null;
  private activityMatrix: HeatmapSeries | null = null;
  private tournamentProgress: TournamentProgress | null = null;

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
          <h2 class="text-xl font-semibold mb-4">Score Differential</h2>
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
    </div>`;
  }

  async render() {
    this.userStats = await getUserStats();
    this.winrateProgression = await getUserWinrateProgression();
    this.activityMatrix = await getUserActivityMatrix();
    this.tournamentProgress = await getUserTournamentProgress();
    this.updateHTML();
    this.rederWinLossChart(this.userStats);
    this.renderWinrateChart();
    //this.renderScoreDiffChart();
    this.renderActivityHeatMap();
    this.renderTournamentProgress();
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

  renderWinrateChart() {
    if (!this.winrateProgression) throw new Error("winrateProgression is null");

    const options = {
      chart: {
        type: "line",
        fontFamily: "inherit",
        background: "transparent",
        width: 750,
        height: 300
      },
      series: [
        {
          name: "Winrate",
          data: this.winrateProgression
        }
      ],
      colors: ["var(--color-neon-cyan)"],
      xaxis: {
        type: "category",
        labels: {
          formatter: (val: string) => `#${val}`
        }
      },
      yaxis: {
        title: { text: "Winrate" },
        labels: { formatter: (val: number) => `${val}%` }
      },
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 5 },
      tooltip: {
        theme: "dark",
        y: { formatter: (val: number) => `${val.toFixed(2)}%` }
      }
    };

    const chartEl = document.querySelector("#winrate-chart");
    if (!chartEl) throw new Error("Chart element not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }

  // renderScoreDiffChart() {
  //   if (!this.matches) throw new Error("Matches is null");

  //   const scoreDiffs = this.matches.reverse().map(this.getScoreDiff);

  //   const matchLabels = this.matches.map((match, i) =>
  //     match.date ? new Date(match.date).toLocaleDateString() : `Match ${i + 1}`
  //   );

  //   const options = {
  //     chart: {
  //       type: "bar",
  //       fontFamily: "inherit",
  //       background: "transparent"
  //     },
  //     series: [
  //       {
  //         name: "Score Difference",
  //         data: scoreDiffs
  //       }
  //     ],
  //     xaxis: {
  //       categories: matchLabels,
  //       title: {
  //         text: "Matches"
  //       }
  //     },
  //     plotOptions: {
  //       bar: {
  //         distributed: true,
  //         colors: {
  //           ranges: [
  //             {
  //               from: -100,
  //               to: -1,
  //               color: "var(--color-neon-red)"
  //             },
  //             {
  //               from: 0,
  //               to: 100,
  //               color: "var(--color-neon-cyan)"
  //             }
  //           ]
  //         }
  //       }
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Score Differential"
  //       },
  //       labels: {
  //         formatter: (val: number) => `${val}`
  //       }
  //     },
  //     tooltip: {
  //       theme: "dark",
  //       y: {
  //         formatter: (val: number) => `${val > 0 ? "+" : ""}${val}`
  //       }
  //     },
  //     legend: {
  //       show: false
  //     }
  //   };

  //   const chartEl = document.querySelector("#score-diff-chart");
  //   if (!chartEl) throw new Error("Chart element score-diff-chart not found");

  //   const chart = new ApexCharts(chartEl, options);
  //   chart.render();
  // }

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
    if (!this.tournamentProgress) throw new Error("TournamentProgress is null");

    const sizes = Object.keys(this.tournamentProgress)
      .map(Number)
      .sort((a, b) => a - b);

    const wonData = sizes.map((size) => this.tournamentProgress![size].won);
    const lostData = sizes.map(
      (size) =>
        this.tournamentProgress![size].played -
        this.tournamentProgress![size].won
    );

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
      series: [
        {
          name: "Won",
          data: wonData
        },
        {
          name: "Lost",
          data: lostData
        }
      ],
      xaxis: {
        categories: sizes.map((size) => `${size}-Player`),
        title: {
          text: "Tournament Size"
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

  getScoreDiff(match: Match): number {
    if (!match.playedAs) return 0;

    const userScore =
      match.playedAs === "PLAYERONE" ? match.player1Score : match.player2Score;
    const opponentScore =
      match.playedAs === "PLAYERONE" ? match.player2Score : match.player1Score;

    return userScore - opponentScore;
  }
}
