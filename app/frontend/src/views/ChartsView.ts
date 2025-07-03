import { getUserMatches } from "../services/userServices.js";
import {
  getUserActivityMatrix,
  getUserStats,
  getUserTournamentProgress
} from "../services/userStatsServices.js";
import type { Match } from "../types/IMatch.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;
  private activityMatrix: HeatmapSeries | null = null;
  private tournamentProgress: TournamentProgress[] | null = null;

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
          <h2 class="text-xl font-semibold mb-4">Tournament Progress</h2>
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
    this.matches = await getUserMatches();
    this.activityMatrix = await getUserActivityMatrix();
    this.tournamentProgress = await getUserTournamentProgress();
    this.updateHTML();
    this.rederWinLossChart(this.userStats);
    this.renderWinrateChart();
    this.renderScoreDiffChart();
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
    if (!this.matches) throw new Error("Matches is null");
    if (!this.userStats) throw new Error("User Stats is null");

    const hasPlayedFewerThanTen = this.userStats.matchesPlayed < 10;
    const lastTenMatchesWithResults = this.matches
      .map((match) => ({
        ...match,
        result: this.didUserWin(match)
      }))
      .reverse();

    const winsInLastTen = lastTenMatchesWithResults.reduce(
      (acc, m) => acc + (m.result ? 1 : 0),
      0
    );

    const matchesBeforeLastTen = hasPlayedFewerThanTen
      ? 0
      : this.userStats.matchesPlayed - lastTenMatchesWithResults.length;

    let cumulativeWins = hasPlayedFewerThanTen
      ? 0
      : this.userStats.matchesWon - winsInLastTen;
    let cumulativeMatches = hasPlayedFewerThanTen
      ? 0
      : this.userStats.matchesPlayed - lastTenMatchesWithResults.length;

    const winrateProgression = lastTenMatchesWithResults.map((match) => {
      if (match.result) cumulativeWins++;
      cumulativeMatches++;
      return (cumulativeWins / cumulativeMatches) * 100;
    });

    const minWinrate = Math.min(...winrateProgression);
    const maxWinrate = Math.max(...winrateProgression);

    // Calculate min and max with padding
    const padding = 3;
    let yAxisMin = Math.max(0, Math.floor(minWinrate - padding));
    let yAxisMax = Math.min(100, Math.ceil(maxWinrate + padding));

    // Ensure minimum range for clarity
    if (yAxisMax - yAxisMin < 10) {
      const mid = (yAxisMax + yAxisMin) / 2;
      const halfRange = 5;
      yAxisMin = Math.max(0, mid - halfRange);
      yAxisMax = Math.min(100, mid + halfRange);
    }

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
          data: winrateProgression.map((wr) => Number(wr.toFixed(2)))
        }
      ],
      colors: ["var(--color-neon-cyan)"],
      xaxis: {
        categories: lastTenMatchesWithResults.map(
          (_, i) => `#${matchesBeforeLastTen + i + 1}`
        )
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

  renderScoreDiffChart() {
    if (!this.matches) throw new Error("Matches is null");

    const scoreDiffs = this.matches.reverse().map(this.getScoreDiff);

    const matchLabels = this.matches.map((match, i) =>
      match.date ? new Date(match.date).toLocaleDateString() : `Match ${i + 1}`
    );

    const options = {
      chart: {
        type: "bar",
        fontFamily: "inherit",
        background: "transparent"
      },
      series: [
        {
          name: "Score Difference",
          data: scoreDiffs
        }
      ],
      xaxis: {
        categories: matchLabels,
        title: {
          text: "Matches"
        }
      },
      plotOptions: {
        bar: {
          distributed: true,
          colors: {
            ranges: [
              {
                from: -100,
                to: -1,
                color: "var(--color-neon-red)"
              },
              {
                from: 0,
                to: 100,
                color: "var(--color-neon-cyan)"
              }
            ]
          }
        }
      },
      yaxis: {
        title: {
          text: "Score Differential"
        },
        labels: {
          formatter: (val: number) => `${val}`
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val: number) => `${val > 0 ? "+" : ""}${val}`
        }
      },
      legend: {
        show: false
      }
    };

    const chartEl = document.querySelector("#score-diff-chart");
    if (!chartEl) throw new Error("Chart element score-diff-chart not found");

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
    if (!this.tournamentProgress) throw new Error("TournamentProgress is null");

    const sizeColorMap: Record<number, string> = {
      4: "var(--color-neon-green)",
      8: "var(--color-neon-cyan)",
      16: "var(--color-neon-purple)"
    };

    const sizeLegendMap: Record<number, string> = {
      4: "4 Players",
      8: "8 Players",
      16: "16 Players"
    };

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: "bar",
        background: "transparent",
        fontFamily: "inherit",
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true
        }
      },
      xaxis: {
        title: {
          text: "Progress (%)"
        },
        max: 100
      },
      yaxis: {
        labels: {
          style: {
            colors: "var(--color-grey)"
          }
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val: number, opts: { dataPointIndex: number }) => {
            const t = this.tournamentProgress![opts.dataPointIndex];
            return `${t.name} (${t.maxPlayers} players): ${val}%`;
          }
        }
      },
      legend: {
        show: true,
        markers: {
          fillColors: Object.values(sizeColorMap)
        },
        labels: {
          colors: "var(--color-grey)"
        },
        customLegendItems: Object.values(sizeLegendMap)
      },
      colors: this.tournamentProgress.map((t) => sizeColorMap[t.maxPlayers]),
      series: [
        {
          name: "Tournament Progress",
          data: this.tournamentProgress.map((t) => t.progress)
        }
      ],
      labels: this.tournamentProgress.map((t) => t.name)
    };

    const chartEl = document.querySelector("#tournament-progress-chart");
    if (!chartEl)
      throw new Error("Chart element tournament-progress-chart not found");

    const chart = new ApexCharts(chartEl, options);
    chart.render();
  }

  didUserWin(match: Match): boolean {
    if (!match.playedAs) return false;

    if (match.playedAs === "PLAYERONE") {
      return match.player1Score > match.player2Score;
    } else if (match.playedAs === "PLAYERTWO") {
      return match.player2Score > match.player1Score;
    }

    return false;
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
