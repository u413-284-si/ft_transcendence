import { makeTournamentPlayedOptions } from "../../charts/tournamentPlayedOptions.js";
import { makeTournamentProgressOptions } from "../../charts/tournamentProgressOptions.js";
import { maketournamentLastNDaysOptions } from "../../charts/tournamentsLastNDaysOptions.js";
import { maketournamentSummaryOptions } from "../../charts/tournamentSummaryOptions.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { Table } from "../../components/Table.js";
import {
  NoTournamentsRow,
  TournamentRow
} from "../../components/TournamentRow.js";
import { getDataOrThrow } from "../../services/api.js";
import { getUserTournaments } from "../../services/tournamentService.js";
import { getUserDashboardTournamentsByUsername } from "../../services/userStatsServices.js";
import { DashboardTournaments } from "../../types/DataSeries.js";
import { TournamentDTO } from "../../types/ITournament.js";
import { AbstractTab } from "./AbstractTab.js";

export class TournamentsTab extends AbstractTab {
  private tournaments: TournamentDTO[] | null = null;
  private dashboard: DashboardTournaments | null = null;
  private username: string;

  constructor(username: string) {
    super();
    this.username = username;
  }

  getHTML(): string {
    return /* HTML */ ` <div id="tab-tournaments">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "tournament-dashboard-header",
          variant: "default"
        })}
        ${this.getDashboardHTML()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.details"),
          id: "tournament-details-header",
          variant: "default"
        })}
        <div id="tournaments-history-table"></div>
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

  updateTournamentsTable(tournaments: TournamentDTO[]): void {
    const table = document.getElementById("tournaments-history-table");

    const tournamentsRows =
      tournaments.length === 0
        ? [NoTournamentsRow()]
        : tournaments.map((tournament: TournamentDTO) =>
            TournamentRow(tournament)
          );

    table!.innerHTML = /* HTML */ `${Table({
      id: "tournaments-history-table",
      headers: [
        i18next.t("newTournamentView.tournamentName"),
        i18next.t("newTournamentView.numberOfPlayers"),
        i18next.t("statsView.usedNickname"),
        i18next.t("statsView.result")
      ],
      rows: tournamentsRows
    })}`;
  }

  override async onShow(): Promise<void> {
    await super.onShow();
    this.updateTournamentsTable(this.tournaments!);
  }

  async init(): Promise<void> {
    this.dashboard = getDataOrThrow(
      await getUserDashboardTournamentsByUsername(this.username)
    );
    this.tournaments = getDataOrThrow(await getUserTournaments());
    this.populateChartOptions();
    this.isInit = true;
  }

  private populateChartOptions(): void {
    if (!this.dashboard) throw new Error(i18next.t("error.somethingWentWrong"));

    this.chartOptions = {
      "tournament-summary": maketournamentSummaryOptions(
        i18next.t("chart.summary"),
        this.dashboard.summary
      ),
      "tournament-played": makeTournamentPlayedOptions(
        this.dashboard.lastNDays
      ),
      "tournament-last-10-days-4": maketournamentLastNDaysOptions(
        this.dashboard.lastNDays[4],
        4
      ),
      "tournament-progress-4": makeTournamentProgressOptions(
        this.dashboard.progress[4].reverse(),
        4
      ),
      "tournament-last-10-days-8": maketournamentLastNDaysOptions(
        this.dashboard.lastNDays[8],
        8
      ),
      "tournament-progress-8": makeTournamentProgressOptions(
        this.dashboard.progress[8].reverse(),
        8
      ),
      "tournament-last-10-days-16": maketournamentLastNDaysOptions(
        this.dashboard.lastNDays[16],
        16
      ),
      "tournament-progress-16": makeTournamentProgressOptions(
        this.dashboard.progress[16].reverse(),
        16
      )
    };
  }
}
