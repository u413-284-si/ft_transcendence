import { getUserTournamentProgress } from "../services/userStatsServices.js";
import { TournamentProgressSeries } from "../types/DataSeries.js";
import AbstractView from "./AbstractView.js";
import { makeChartOptions, renderChart } from "../charts/utils.js";
import { tournamentProgressOptions } from "../charts/tournamentProgressOptions.js";
import { Chart } from "../components/Chart.js";

export default class ChartsView extends AbstractView {
  private tournamentProgressSeries: TournamentProgressSeries | null = null;

  constructor() {
    super();
    this.setTitle("Charts");
  }

  createHTML() {
    return /* HTML */ `<div>
      ${Chart({
        title: "Tournament Summary",
        chartId: "tournament-progress-chart"
      })}
      ${Chart({ title: "Win Streak Radial", chartId: "streak-chart" })}
    </div>`;
  }

  async render() {
    this.tournamentProgressSeries = await getUserTournamentProgress();
    this.updateHTML();

    renderChart(
      "tournament-progress-chart",
      makeChartOptions(tournamentProgressOptions, this.tournamentProgressSeries)
    );
  }

  getName(): string {
    return "charts";
  }
}
