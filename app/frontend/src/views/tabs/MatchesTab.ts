import { buildMatchesScoreDiffOptions } from "../../charts/matchesScoreDiffOptions.js";
import { buildMatchesScoresLastTenDaysOptions } from "../../charts/matchesScoresLastTenDaysOptions.js";
import { buildMatchesWinLossOptions } from "../../charts/matchesWinLossOptions.js";
import { buildMatchesWinRateOptions } from "../../charts/matchesWinRateOptions.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { MatchRow, NoMatchesRow } from "../../components/MatchRow.js";
import { PaginationControls } from "../../components/PaginationControls.js";
import { Table } from "../../components/Table.js";
import { Paginator } from "../../Paginator.js";
import { getDataOrThrow } from "../../services/api.js";
import { getUserPlayedMatchesByUsername } from "../../services/userServices.js";
import { getUserDashboardMatchesByUsername } from "../../services/userStatsServices.js";
import { toaster } from "../../Toaster.js";
import { DashboardMatches } from "../../types/DataSeries.js";
import { Match } from "../../types/IMatch.js";
import { UserStats } from "../../types/IUserStats.js";
import { AbstractTab } from "./AbstractTab.js";

export class MatchesTab extends AbstractTab {
  private dashboard: DashboardMatches | null = null;
  private userStats: UserStats;
  private username: string;
  private paginator = new Paginator<Match>(10);

  constructor(userStats: UserStats, username: string) {
    super();
    this.userStats = userStats;
    this.username = username;
  }

  getHTML(): string {
    return /* HTML */ ` <div id="tab-matches" class="tab-content">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "match-dashboard-header",
          variant: "default"
        })}
        ${this.getDashboardHTML()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.details"),
          id: "match-details-header",
          variant: "default"
        })}
        <div id="match-history-table"></div>
        ${PaginationControls({
          prevId: "matches-prev-btn",
          nextId: "matches-next-btn",
          indicatorId: "matches-page-indicator",
          prevLabel: "<",
          nextLabel: ">"
        })}
      </div>
    </div>`;
  }

  getDashboardHTML(): string {
    const rangeMatches = i18next.t("chart.rangeLastMatches", { count: 10 });
    const rangeDays = i18next.t("chart.rangeLastDays", { count: 10 });

    return /* HTML */ `<div class="p-6 mx-auto space-y-8 min-h-screen">
      <div class="flex flex-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: "" }),
          chartId: "win-loss-chart"
        })}
        ${Chart({
          title: i18next.t("chart.progression", { range: rangeMatches }),
          chartId: "win-rate-chart"
        })}
      </div>
      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.scoreDiff", { range: rangeMatches }),
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: i18next.t("chart.scores", { range: rangeDays }),
          chartId: "scores-last-ten-chart"
        })}
      </div>
    </div>`;
  }

  updateMatchesTable(matches: Match[]): void {
    const table = document.getElementById("match-history-table");

    const matchesRows =
      matches.length === 0
        ? [NoMatchesRow()]
        : matches.map((matchRaw: Match) => MatchRow(matchRaw, this.username));

    table!.innerHTML = /* HTML */ `${Table({
      id: "match-history-table",
      headers: [
        i18next.t("statsView.player1"),
        i18next.t("statsView.player1Score"),
        i18next.t("statsView.player2"),
        i18next.t("statsView.player2Score"),
        i18next.t("statsView.result"),
        i18next.t("statsView.date"),
        i18next.t("statsView.tournament")
      ],
      rows: matchesRows
    })}`;
  }

  override async onShow(): Promise<void> {
    await super.onShow();
    await this.loadPage(this.paginator.getCurrentPage());
    this.addListeners();
  }

  async init(): Promise<void> {
    this.dashboard = getDataOrThrow(
      await getUserDashboardMatchesByUsername(this.username)
    );
    this.populateMatchesCharts();
    this.isInit = true;
  }

  private populateMatchesCharts(): void {
    if (!this.dashboard) throw new Error(i18next.t("error.somethingWentWrong"));

    this.chartOptions = {
      "win-loss-chart": buildMatchesWinLossOptions(
        this.userStats.matchesWon,
        this.userStats.matchesLost,
        this.userStats.winRate
      ),
      "win-rate-chart": buildMatchesWinRateOptions(
        i18next.t("statsView.winRate"),
        this.dashboard.winrate,
        this.userStats.matchesPlayed
      ),
      "score-diff-chart": buildMatchesScoreDiffOptions(
        i18next.t("chart.scoreDiff", { range: "" }),
        this.dashboard.scoreDiff,
        this.userStats.matchesPlayed
      ),
      "scores-last-ten-chart": buildMatchesScoresLastTenDaysOptions(
        i18next.t("chart.scores", { range: "" }),
        this.dashboard.scores
      )
    };
  }

  private async loadPage(page: number) {
    const cached = this.paginator.getCachedPage(page);
    if (cached) {
      this.updateMatchesTable(cached);
      this.updatePaginationControls();
      return;
    }

    const limit = this.paginator.getPageSize();
    const offset = page * limit;

    try {
      const response = getDataOrThrow(
        await getUserPlayedMatchesByUsername(this.username, limit, offset)
      );

      this.paginator.setTotalItems(response.total);
      this.paginator.cachePage(page, response.items);
      this.updateMatchesTable(response.items);
      this.updatePaginationControls();
    } catch (error) {
      console.error("Failed to load matches page:", error);
      toaster.error("Failed to fetch");
    }
  }

  private updatePaginationControls() {
    const prevBtn =
      document.querySelector<HTMLButtonElement>("#matches-prev-btn");
    const nextBtn =
      document.querySelector<HTMLButtonElement>("#matches-next-btn");
    const pageIndicator = document.querySelector<HTMLSpanElement>(
      "#matches-page-indicator"
    );
    if (!prevBtn || !nextBtn || !pageIndicator) return;

    prevBtn.disabled = !this.paginator.canGoPrev();
    nextBtn.disabled = !this.paginator.canGoNext();

    const currentPage = this.paginator.getCurrentPage() + 1;
    const totalPages = this.paginator.getTotalPages();
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
  }

  public async goPrevPage() {
    if (this.paginator.canGoPrev()) {
      this.paginator.goPrev();
      await this.loadPage(this.paginator.getCurrentPage());
    }
  }

  public async goNextPage() {
    if (this.paginator.canGoNext()) {
      this.paginator.goNext();
      await this.loadPage(this.paginator.getCurrentPage());
    }
  }

  addListeners() {
    const prevBtn =
      document.querySelector<HTMLButtonElement>("#matches-prev-btn");
    const nextBtn =
      document.querySelector<HTMLButtonElement>("#matches-next-btn");
    if (!prevBtn || !nextBtn) return;

    prevBtn.addEventListener("click", () => this.goPrevPage());
    nextBtn.addEventListener("click", () => this.goNextPage());
  }
}
