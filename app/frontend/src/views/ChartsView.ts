import { getUserMatches } from "../services/userServices.js";
import { getUserStats } from "../services/userStatsServices.js";
import type { Match } from "../types/IMatch.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;

  constructor() {
    super();
    this.setTitle("Charts");
  }

  createHTML() {
    return /* HTML */ `<div id="chart" class="w-[300px] h-[300px]"></div>
      <div id="winrate-chart" class="w-[500px] h-[300px]"></div>
      <div id="score-diff-chart"></div>`;
  }

  async render() {
    this.userStats = await getUserStats();
    this.matches = await getUserMatches();
    this.updateHTML();
    this.rederWinLossChart(this.userStats);
    this.renderWinrateChart();
    this.renderScoreDiffChart();
  }

  getName(): string {
    return "charts";
  }

  rederWinLossChart(stats: UserStats) {
    const options = {
      chart: {
        type: "pie",
        fontFamily: "inherit",
        background: "transparent"
      },
      labels: ["Wins", "Losses"],
      series: [stats.matchesWon, stats.matchesLost],
      colors: ["#00ffff", "#ff0044"],
      title: {
        text: "Wins vs Losses",
        style: {
          color: "#00ffff",
          fontSize: "20px"
        }
      },
      legend: {
        labels: {
          colors: ["#00ffff", "#00ffff"]
        }
      }
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
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
      chart: { type: "line", height: 350 },
      series: [
        {
          name: "Winrate (%)",
          data: winrateProgression.map((wr) => Number(wr.toFixed(2)))
        }
      ],
      xaxis: {
        categories: lastTenMatchesWithResults.map(
          (_, i) => `Match ${matchesBeforeLastTen + i + 1}`
        ),
        title: { text: "Match Number" }
      },
      yaxis: {
        min: yAxisMin,
        max: yAxisMax,
        title: { text: "Winrate (%)" },
        labels: { formatter: (val: number) => `${val}%` }
      },
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 5 },
      tooltip: { y: { formatter: (val: number) => `${val.toFixed(2)}%` } }
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
        height: 350
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
                color: "#ef4444" // red for losses
              },
              {
                from: 0,
                to: 100,
                color: "#22c55e" // green for wins
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
        y: {
          formatter: (val: number) => `${val > 0 ? "+" : ""}${val}`
        }
      }
    };

    const chartEl = document.querySelector("#score-diff-chart");
    if (!chartEl) throw new Error("Chart element score-diff-chart not found");

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
