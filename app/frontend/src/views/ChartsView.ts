import { getUserStats } from "../services/userStatsServices.js";
import { UserStats } from "../types/IUserStats.js";
import AbstractView from "./AbstractView.js";

export default class ChartsView extends AbstractView {
  private userStats: UserStats | null = null;

  constructor() {
    super();
    this.setTitle("Charts");
  }

  createHTML() {
    return /* HTML */ `<div id="chart" class="w-[300px] h-[300px]"></div>`;
  }

  async render() {
    this.userStats = await getUserStats();
    this.updateHTML();
    this.createWinLossChart(this.userStats);
  }

  getName(): string {
    return "charts";
  }

  createWinLossChart(stats: UserStats) {
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
}
