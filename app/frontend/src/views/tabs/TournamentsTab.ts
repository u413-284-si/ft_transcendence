import { buildTournamentsPlayedOptions } from "../../charts/tournamentsPlayedOptions.js";
import { buildTournamentsProgressOptions } from "../../charts/tournamentsProgressOptions.js";
import { buildTournamentsLastTenDaysOptions } from "../../charts/tournamentsLastTenDaysOptions.js";
import { buildTournamentsSummaryOptions } from "../../charts/tournamentsSummaryOptions.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { getDataOrThrow } from "../../services/api.js";
import { getUserDashboardTournamentsByUsername } from "../../services/userStatsServices.js";
import { DashboardTournaments } from "../../types/DataSeries.js";
import { PaginatedTab } from "./PaginatedTab.js";
import { TournamentDTO } from "../../types/ITournament.js";
import { PaginationControls } from "../../components/PaginationControls.js";
import {
  NoTournamentsRow,
  TournamentRow
} from "../../components/TournamentRow.js";
import { Table } from "../../components/Table.js";
import { getUserTournamentsByUsername } from "../../services/tournamentService.js";

export class TournamentsTab extends PaginatedTab<TournamentDTO> {
  private dashboard: DashboardTournaments | null = null;
  private username: string;

  constructor(username: string) {
    super(
      10,
      "tournaments-prev-btn",
      "tournaments-next-btn",
      "tournaments-page-indicator"
    );
    this.username = username;
  }

  getHTML(): string {
    return /* HTML */ ` <div id="tab-tournaments">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-4">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "tournament-dashboard-header",
          variant: "default"
        })}
        ${this.getDashboardHTML()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-4">
        ${Header1({
          text: i18next.t("statsView.details"),
          id: "tournament-details-header",
          variant: "default"
        })}
        <div id="tournament-history-table" class="p-6"></div>
        ${PaginationControls({
          prevId: "tournaments-prev-btn",
          nextId: "tournaments-next-btn",
          indicatorId: "tournaments-page-indicator",
          prevLabel: "<",
          nextLabel: ">"
        })}
      </div>
    </div>`;
  }

  getDashboardHTML(): string {
    const rangeDays = i18next.t("chart.rangeLastDays", { count: 10 });

    return /* HTML */ `<div class="p-6 mx-auto space-y-8">
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.summary"),
          chartId: "tournament-summary"
        })}
        ${Chart({
          title: i18next.t("chart.played", { range: rangeDays }),
          chartId: "tournament-played"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: rangeDays }),
          chartId: "tournament-last-10-days-4"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 4 }),
          chartId: "tournament-progress-4"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: rangeDays }),
          chartId: "tournament-last-10-days-8"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 8 }),
          chartId: "tournament-progress-8"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: rangeDays }),
          chartId: "tournament-last-10-days-16"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 16 }),
          chartId: "tournament-progress-16"
        })}
      </div>
    </div>`;
  }

  protected updateTable(tournaments: TournamentDTO[]): void {
    const table = document.getElementById("tournament-history-table");
    if (!table) return;

    const tournamentsRows =
      tournaments.length === 0
        ? [NoTournamentsRow()]
        : tournaments.map((tournament: TournamentDTO) =>
            TournamentRow(tournament)
          );

    table.innerHTML = Table({
      id: "tournament-history-table",
      headers: [
        i18next.t("newTournamentView.tournamentName"),
        i18next.t("newTournamentView.numberOfPlayers"),
        i18next.t("statsView.usedNickname"),
        i18next.t("statsView.result")
      ],
      rows: tournamentsRows
    });
  }

  protected async fetchPage(limit: number, offset: number) {
    return getDataOrThrow(
      await getUserTournamentsByUsername(this.username, limit, offset)
    );
  }

  async init(): Promise<void> {
    this.dashboard = getDataOrThrow(
      await getUserDashboardTournamentsByUsername(this.username)
    );
    this.populateChartOptions();
    this.isInit = true;
  }

  private populateChartOptions(): void {
    if (!this.dashboard) throw new Error(i18next.t("error.somethingWentWrong"));

    this.chartOptions = {
      "tournament-summary": buildTournamentsSummaryOptions(
        i18next.t("chart.summary"),
        this.dashboard.summary
      ),
      "tournament-played": buildTournamentsPlayedOptions(
        this.dashboard.lastTenDays
      ),
      "tournament-last-10-days-4": buildTournamentsLastTenDaysOptions(
        this.dashboard.lastTenDays[4],
        4
      ),
      "tournament-progress-4": buildTournamentsProgressOptions(
        this.dashboard.progress[4].reverse(),
        4
      ),
      "tournament-last-10-days-8": buildTournamentsLastTenDaysOptions(
        this.dashboard.lastTenDays[8],
        8
      ),
      "tournament-progress-8": buildTournamentsProgressOptions(
        this.dashboard.progress[8].reverse(),
        8
      ),
      "tournament-last-10-days-16": buildTournamentsLastTenDaysOptions(
        this.dashboard.lastTenDays[16],
        16
      ),
      "tournament-progress-16": buildTournamentsProgressOptions(
        this.dashboard.progress[16].reverse(),
        16
      )
    };
  }
}
