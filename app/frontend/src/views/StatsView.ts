import AbstractView from "./AbstractView.js";
import {
  getUserDashboardFriends,
  getUserDashboardMatches,
  getUserDashboardMatchesByUsername,
  getUserDashboardTournaments,
  getUserDashboardTournamentsByUsername,
  getUserStats,
  getUserStatsByUsername
} from "../services/userStatsServices.js";
import {
  getUserByUsername,
  getUserPlayedMatches,
  getUserPlayedMatchesByUsername
} from "../services/userServices.js";
import { escapeHTML, getEl } from "../utility.js";
import { auth } from "../AuthManager.js";
import { Header1 } from "../components/Header1.js";
import { Table } from "../components/Table.js";
import { MatchRow, NoMatchesRow } from "../components/MatchRow.js";
import { Match } from "../types/IMatch.js";
import { router } from "../routing/Router.js";
import { getUserFriendRequestByUsername } from "../services/friendsServices.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { User } from "../types/User.js";
import { UserStats } from "../types/IUserStats.js";
import { Paragraph } from "../components/Paragraph.js";
import { StatFieldGroup } from "../components/StatField.js";
import { getDataOrThrow } from "../services/api.js";
import { TabButton } from "../components/TabButton.js";
import { Chart } from "../components/Chart.js";
import {
  DashboardFriends,
  DashboardMatches,
  DashboardTournaments,
  FriendStatsSeries
} from "../types/DataSeries.js";
import { makeWinLossOptions } from "../charts/winLossOptions.js";
import { makeWinrateOptions } from "../charts/winrateOptions.js";
import { makeScoreDiffOptions } from "../charts/scoreDiffOptions.js";
import { makeScoresLastTenDaysOptions } from "../charts/scoresLastTenDaysOptions.js";
import {
  addFriend,
  getColor,
  removeFriend,
  renderChart
} from "../charts/utils.js";
import { maketournamentSummaryOptions } from "../charts/tournamentSummaryOptions.js";
import { makeTournamentProgressOptions } from "../charts/tournamentProgressOptions.js";
import { maketournamentLastNDaysOptions } from "../charts/tournamentsLastNDaysOptions.js";
import { toaster } from "../Toaster.js";
import { formatDate } from "../formatDate.js";
import { TextBox } from "../components/TextBox.js";
import { makeTournamentPlayedOptions } from "../charts/tournamentPlayedOptions.js";
import { makeFriendsWinRateOptions } from "../charts/friendsWinRateOptions.js";
import { makeFriendsMatchStatsOptions } from "../charts/friendsMatchStatsOptions.js";
import { makeFriendsWinstreakOptions } from "../charts/friendsWinstreakOptions.js";
import { Header3 } from "../components/Header3.js";

export default class StatsView extends AbstractView {
  private viewType: "self" | "friend" | "public" = "public";
  private username = escapeHTML(router.getParams().username);
  private user: User | null = null;
  private userStats: UserStats | null = null;
  private matches: Match[] | null = null;
  private friendRequest: FriendRequest | null = null;
  private dashboardMatches: DashboardMatches | null = null;
  private dashboardTournaments: DashboardTournaments | null = null;
  private dashboardFriends: DashboardFriends | null = null;
  private charts: Record<string, Record<string, ApexCharts>> = {};
  private chartOptions: Record<string, Record<string, ApexCharts.ApexOptions>> =
    {};
  private rangeMatches = i18next.t("chart.rangeLastMatches", { count: 10 });
  private rangeDays = i18next.t("chart.rangeLastDays", { count: 10 });
  private selectedFriends: string[] = [`${this.username}`];

  constructor() {
    super();
    this.setTitle(i18next.t("statsView.title"));
  }

  createHTML() {
    if (!this.user) throw new Error(i18next.t("error.userNotFound"));
    if (!this.userStats) throw new Error(i18next.t("error.userStatsNotFound"));

    return /* HTML */ `<div
        class="flex flex-row items-center gap-y-6 gap-x-8 mb-12 pl-6"
      >
        <img
          src=${this.user.avatar || "/images/default-avatar.png"}
          alt=${i18next.t("global.avatar")}
          class="w-20 h-20 rounded-full border-2 border-neon-cyan shadow-neon-cyan"
        />
        <div class="flex flex-col md:flex-row md:items-center md:gap-x-8">
          <div>
            ${Header1({
              text: escapeHTML(this.username),
              variant: "username"
            })}
            ${Paragraph({
              text: i18next.t("statsView.joined", {
                date: formatDate(this.user.dateJoined)
              })
            })}
          </div>
          ${StatFieldGroup([
            {
              value: `${this.userStats.matchesPlayed}`,
              text: i18next.t("statsView.played")
            },
            {
              value: `${this.userStats.matchesWon}`,
              text: i18next.t("global.won")
            },
            {
              value: `${this.userStats.matchesLost}`,
              text: i18next.t("global.lost")
            }
          ])}
          ${StatFieldGroup([
            {
              value: `${this.userStats.winRate.toFixed(2)} %`,
              text: i18next.t("statsView.winRate")
            },
            {
              value: `${this.userStats.winstreakCur}`,
              text: i18next.t("statsView.winstreak")
            },
            {
              value: `${this.userStats.winstreakMax}`,
              text: i18next.t("statsView.maxStreak")
            }
          ])}
        </div>
      </div>

      ${this.getTabsHTML()} `;
  }

  async render() {
    await this.setViewType();
    await this.fetchData();
    this.updateHTML();
    if (this.viewType === "public") return;
    this.addListeners();
    addFriend(this.username);
    this.renderFriendSelector(this.dashboardFriends!.matchStats);
    this.populateChartOptions();
    this.initChartsForTab("matches");
  }

  getTabsHTML(): string {
    if (this.viewType === "public") {
      return /* HTML */ ` ${TextBox({
        text: [i18next.t("statsView.friendOnly")],
        variant: "info"
      })}`;
    }
    return /* HTML */ `
      <div class="flex space-x-4 border-b border-grey mb-4">
        ${TabButton({
          text: i18next.t("statsView.matches"),
          tabId: "matches",
          isActive: true
        })}
        ${TabButton({
          text: i18next.t("statsView.tournaments"),
          tabId: "tournaments"
        })}
        ${this.viewType === "self"
          ? TabButton({
              text: i18next.t("statsView.friends"),
              tabId: "friends"
            })
          : ""}
      </div>
      ${this.getMatchesTabHTML()} ${this.getTournamentsTabHTML()}
      ${this.viewType === "self" ? this.getFriendsTabHTML() : ""}
    `;
  }

  getMatchesTabHTML(): string {
    return /* HTML */ ` <div id="tab-matches" class="tab-content">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "match-dashboard-header",
          variant: "default"
        })}
        ${this.getMatchesDashboard()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.details"),
          id: "match-details-header",
          variant: "default"
        })}
        ${this.getMatchesTableHTML()}
      </div>
    </div>`;
  }

  getMatchesDashboard(): string {
    return /* HTML */ `<div class="p-6 mx-auto space-y-8 min-h-screen">
      <div class="flex flex-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: "" }),
          chartId: "win-loss-chart"
        })}
        ${Chart({
          title: i18next.t("chart.progression", { range: this.rangeMatches }),
          chartId: "winrate-chart"
        })}
      </div>

      <div class="grid grid-cols-2 gap-8">
        ${Chart({
          title: i18next.t("chart.scoreDiff", { range: this.rangeMatches }),
          chartId: "score-diff-chart"
        })}
        ${Chart({
          title: i18next.t("chart.scores", { range: this.rangeDays }),
          chartId: "scores-last-ten"
        })}
      </div>
    </div>`;
  }

  getMatchesTableHTML(): string {
    if (!this.matches) throw new Error(i18next.t("error.matchesNotFound"));

    const matchesRows =
      this.matches.length === 0
        ? [NoMatchesRow()]
        : this.matches.map((matchRaw: Match) =>
            MatchRow(matchRaw, this.username)
          );

    return /* HTML */ `${Table({
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

  getTournamentsTabHTML(): string {
    return /* HTML */ ` <div id="tab-tournaments" class="tab-content hidden">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "tournament-dashboard-header",
          variant: "default"
        })}
        ${this.getTournamentsDashboard()}
      </div>
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.details"),
          id: "tournament-details-header",
          variant: "default"
        })}
        ${this.getTournamentsTableHTML()}
      </div>
    </div>`;
  }

  getTournamentsDashboard(): string {
    return /* HTML */ `<div class="p-6 mx-auto space-y-8">
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.summary"),
          chartId: "tournament-summary"
        })}
        ${Chart({
          title: i18next.t("chart.played", { range: this.rangeDays }),
          chartId: "tournament-played"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: this.rangeDays }),
          chartId: "tournament-last-10-days-4"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 4 }),
          chartId: "tournament-progress-4"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: this.rangeDays }),
          chartId: "tournament-last-10-days-8"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 8 }),
          chartId: "tournament-progress-8"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("chart.winLoss", { range: this.rangeDays }),
          chartId: "tournament-last-10-days-16"
        })}
        ${Chart({
          title: i18next.t("chart.progress", { num: 16 }),
          chartId: "tournament-progress-16"
        })}
      </div>
    </div>`;
  }

  getTournamentsTableHTML(): string {
    return /* HTML */ ``;
  }

  getFriendsTabHTML(): string {
    return /* HTML */ ` <div id="tab-friends" class="tab-content hidden">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "friends-dashboard-header",
          variant: "default"
        })}
        ${this.getFriendsDashboard()}
      </div>
    </div>`;
  }

  getFriendsDashboard(): string {
    return /* HTML */ `<div class="p-6 mx-auto space-y-8">
      <div class="flex gap-8">
        <div class="flex flex-col">
          ${Header3({
            text: "Select upto 3 friends",
            variant: "white"
          })}
          <div id="friend-selector"></div>
        </div>
        ${Chart({
          title: i18next.t("chart.activity"),
          chartId: "friends-match-stats"
        })}
      </div>
      <div class="flex gap-8">
        ${Chart({
          title: i18next.t("statsView.winRate"),
          chartId: "friends-winrate"
        })}
        ${Chart({
          title: i18next.t("statsView.winstreak"),
          chartId: "friends-winstreak"
        })}
      </div>
    </div> `;
  }

  renderFriendSelector(friends: FriendStatsSeries) {
    if (!friends || friends.length === 0) {
      console.warn("No friends to display");
      return;
    }
    const container = getEl("friend-selector");

    friends.forEach((friend) => {
      const btn = document.createElement("button");
      btn.innerText = friend.name;
      btn.dataset.friendName = friend.name;
      btn.className = this.selectedFriends.includes(friend.name)
        ? `w-full ${getColor(friend.name)} text-white p-2 m-1`
        : "w-full bg-grey text-black p-2 m-1";

      btn.onclick = () => this.toggleFriendSelection(friend.name, btn);
      container.appendChild(btn);
    });
  }

  toggleFriendSelection(friendName: string, button: HTMLButtonElement) {
    if (friendName === this.username) {
      toaster.warn("You cannot remove yourself");
      return;
    }

    if (this.selectedFriends.includes(friendName)) {
      this.selectedFriends = this.selectedFriends.filter(
        (name) => name !== friendName
      );
      removeFriend(friendName);
    } else {
      if (this.selectedFriends.length < 4) {
        this.selectedFriends.push(friendName);
        addFriend(friendName);
      } else {
        toaster.warn("You can compare a maximum of 3 friends.");
        return;
      }
    }
    this.updateFriendButton(button, friendName);
    this.updateFriendsCharts();
  }

  private updateFriendButton(button: HTMLButtonElement, friendName: string) {
    const isSelected = this.selectedFriends.includes(friendName);
    button.className = isSelected
      ? `w-full ${getColor(friendName)} text-white p-2 m-1`
      : "w-full bg-gray-200 text-black p-2 m-1";
  }

  updateFriendsCharts() {
    if (!this.dashboardFriends)
      throw new Error("Dashboard friends is undefined");

    const winrateOptions = makeFriendsWinRateOptions(
      this.dashboardFriends.winRate,
      this.selectedFriends
    );
    const matchStatsOptions = makeFriendsMatchStatsOptions(
      this.dashboardFriends.matchStats,
      this.selectedFriends
    );
    const winstreakOptions = makeFriendsWinstreakOptions(
      this.dashboardFriends.winstreak,
      this.selectedFriends
    );

    this.charts["friends"]["friends-winrate"].updateOptions(winrateOptions);
    this.charts["friends"]["friends-match-stats"].updateOptions(
      matchStatsOptions
    );
    this.charts["friends"]["friends-winstreak"].updateOptions(winstreakOptions);
  }

  getName(): string {
    return "stats";
  }

  async setViewType() {
    if (this.username === auth.getUser().username) {
      this.viewType = "self";
      this.user = auth.getUser();
      return;
    }
    this.user = getDataOrThrow(await getUserByUsername(this.username));
    if (!this.user) {
      throw new Error(i18next.t("global.userNotFound"));
    }
    const requests = getDataOrThrow(
      await getUserFriendRequestByUsername(this.username)
    );
    if (!requests[0]) return;
    this.friendRequest = requests[0];
    if (this.friendRequest.status === "ACCEPTED") {
      this.viewType = "friend";
    } else {
      this.viewType = "public";
    }
  }

  async fetchData() {
    if (this.viewType === "self") {
      this.userStats = getDataOrThrow(await getUserStats());
      this.dashboardMatches = getDataOrThrow(await getUserDashboardMatches());
      this.dashboardTournaments = getDataOrThrow(
        await getUserDashboardTournaments()
      );
      this.dashboardFriends = getDataOrThrow(await getUserDashboardFriends());
      this.matches = getDataOrThrow(await getUserPlayedMatches());
      return;
    }
    const userStatsArray = getDataOrThrow(
      await getUserStatsByUsername(this.username)
    );
    if (!userStatsArray[0])
      throw new Error(i18next.t("error.userStatsNotFound"));
    this.userStats = userStatsArray[0];
    if (this.viewType === "friend") {
      this.matches = getDataOrThrow(
        await getUserPlayedMatchesByUsername(this.username)
      );
      this.dashboardMatches = getDataOrThrow(
        await getUserDashboardMatchesByUsername(this.username)
      );
      this.dashboardTournaments = getDataOrThrow(
        await getUserDashboardTournamentsByUsername(this.username)
      );
    }
  }

  protected addListeners(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".tab-button");
    const contents = document.querySelectorAll<HTMLDivElement>(".tab-content");

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const tabId = button.dataset.tab!;

        contents.forEach((content) => {
          content.classList.add("hidden");
        });

        buttons.forEach((btn) => {
          btn.classList.remove("active-link");
        });

        const targetContent = document.getElementById(`tab-${tabId}`);
        if (targetContent) targetContent.classList.remove("hidden");

        button.classList.add("active-link");

        requestAnimationFrame(() => {
          this.initChartsForTab(tabId);
        });
      });
    });
  }

  private populateChartOptions(): void {
    this.chartOptions["matches"] = this.populateMatchesCharts();
    this.chartOptions["tournaments"] = this.populateTournamentsCharts();
    if (this.viewType === "self") {
      this.chartOptions["friends"] = this.populateFriendsCharts();
    }
  }

  private populateMatchesCharts(): Record<string, ApexCharts.ApexOptions> {
    if (!this.dashboardMatches || !this.userStats)
      throw new Error("Matches data or user stats is null");

    return {
      "win-loss-chart": makeWinLossOptions(
        this.userStats.matchesWon,
        this.userStats.matchesLost,
        this.userStats.winRate
      ),
      "winrate-chart": makeWinrateOptions(
        i18next.t("statsView.winRate"),
        this.dashboardMatches.winrate,
        this.userStats.matchesPlayed
      ),
      "score-diff-chart": makeScoreDiffOptions(
        i18next.t("chart.scoreDiff", { range: "" }),
        this.dashboardMatches.scoreDiff,
        this.userStats.matchesPlayed
      ),
      "scores-last-ten": makeScoresLastTenDaysOptions(
        i18next.t("chart.scores", { range: "" }),
        this.dashboardMatches.scores
      )
    };
  }

  private populateTournamentsCharts(): Record<string, ApexCharts.ApexOptions> {
    if (!this.dashboardTournaments)
      throw new Error("Tournament matches is null");

    return {
      "tournament-summary": maketournamentSummaryOptions(
        i18next.t("chart.summary"),
        this.dashboardTournaments.summary
      ),
      "tournament-played": makeTournamentPlayedOptions(
        this.dashboardTournaments.lastNDays
      ),
      "tournament-last-10-days-4": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays[4],
        4
      ),
      "tournament-progress-4": makeTournamentProgressOptions(
        this.dashboardTournaments.progress[4].reverse(),
        4
      ),
      "tournament-last-10-days-8": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays[8],
        8
      ),
      "tournament-progress-8": makeTournamentProgressOptions(
        this.dashboardTournaments.progress[8].reverse(),
        8
      ),
      "tournament-last-10-days-16": maketournamentLastNDaysOptions(
        this.dashboardTournaments.lastNDays[16],
        16
      ),
      "tournament-progress-16": makeTournamentProgressOptions(
        this.dashboardTournaments.progress[16].reverse(),
        16
      )
    };
  }

  private populateFriendsCharts(): Record<string, ApexCharts.ApexOptions> {
    if (!this.dashboardFriends) throw new Error("Dashboard friends is null");

    return {
      "friends-winrate": makeFriendsWinRateOptions(
        this.dashboardFriends.winRate,
        this.selectedFriends
      ),
      "friends-match-stats": makeFriendsMatchStatsOptions(
        this.dashboardFriends.matchStats,
        this.selectedFriends
      ),
      "friends-winstreak": makeFriendsWinstreakOptions(
        this.dashboardFriends.winstreak,
        this.selectedFriends
      )
    };
  }

  async initChartsForTab(tabId: string) {
    if (!this.charts[tabId]) {
      this.charts[tabId] = {};
    }

    const optionsForTab = this.chartOptions[tabId];
    if (!optionsForTab) return;

    for (const chartId in optionsForTab) {
      if (this.charts[tabId][chartId]) {
        this.charts[tabId][chartId].destroy();
      }
      try {
        this.charts[tabId][chartId] = await renderChart(
          chartId,
          optionsForTab[chartId]
        );
      } catch (error) {
        console.error(`Chart ${chartId} failed to initialize`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
  }
}
