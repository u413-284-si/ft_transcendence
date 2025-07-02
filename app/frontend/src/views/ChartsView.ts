import { getUserMatches } from "../services/userServices.js";
import {
  getUserActivityMatrix,
  getUserStats
} from "../services/userStatsServices.js";
import type { Match } from "../types/IMatch.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;
  private activityMatrix: HeatmapSeries | null = null;

  constructor() {
    super();
    this.setTitle("Charts");
  }

  createHTML() {
    return /* HTML */ ` <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 place-items-center"
    >
      <div id="win-loss-chart" class="w-[300px] h-[300px]"></div>
      <div id="winrate-chart" class="w-[500px] h-[300px]"></div>
      <div id="score-diff-chart" class="w-[500px] h-[300px]"></div>
      <div id="activity-heatmap-chart" class="w-[500px] h-[300px]"></div>
    </div>`;
  }

  async render() {
    this.userStats = await getUserStats();
    this.matches = await getUserMatches();
    this.activityMatrix = await getUserActivityMatrix();
    this.updateHTML();
    this.rederWinLossChart(this.userStats);
    this.renderWinrateChart();
    this.renderScoreDiffChart();
    this.renderActivityHeatMap();
  }

  getName(): string {
    return "charts";
  }

  rederWinLossChart(stats: UserStats) {
    const options = {
      chart: {
        type: "donut",
        fontFamily: "inherit",
        background: "transparent"
      },
      labels: ["Wins", "Losses"],
      series: [stats.matchesWon, stats.matchesLost],
      colors: ["var(--color-neon-cyan)", "var(--color-neon-red)"],
      title: {
        text: "Wins vs Losses",
        align: "center",
        style: {
          color: "var(--color-grey)",
          fontSize: "20px"
        }
      },
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
    const padding = 5;
    let yAxisMin = Math.max(0, Math.floor(minWinrate - padding));
    let yAxisMax = Math.min(100, Math.ceil(maxWinrate + padding));

    // Ensure minimum range for clarity
    if (yAxisMax - yAxisMin < 10) {
      const mid = (yAxisMax + yAxisMin) / 2;
      const halfRange = 5;
      yAxisMin = Math.max(0, mid - halfRange);
      yAxisMax = Math.min(100, mid + halfRange);
    }

    // Render ApexCharts with this data (same as above)
    const options = {
      chart: { type: "line", fontFamily: "inherit", background: "transparent" },
      series: [
        {
          name: "Winrate",
          data: winrateProgression.map((wr) => Number(wr.toFixed(2)))
        }
      ],
      colors: ["var(--color-neon-cyan)"],
      title: {
        text: "Winrate Progression (Last 10)",
        align: "center",
        style: {
          color: "var(--color-grey)",
          fontSize: "20px"
        },
        offsetY: 10
      },
      xaxis: {
        categories: lastTenMatchesWithResults.map(
          (_, i) => `Match ${matchesBeforeLastTen + i + 1}`
        )
      },
      yaxis: {
        min: yAxisMin,
        max: yAxisMax,
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
      },
      title: {
        text: "Score Differential (Last 10)",
        align: "center",
        style: {
          color: "var(--color-grey)",
          fontSize: "20px"
        }
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
      colors: ["#00A100"], // You can use your Tailwind colors or any hex
      title: {
        text: "User Activity Heatmap",
        style: {
          fontSize: "20px",
          color: "var(--color-grey)"
        }
      },
      xaxis: {
        title: { text: "Hour of Day" }
      },
      yaxis: {
        title: { text: "Day of Week" }
      },
      tooltip: {
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
