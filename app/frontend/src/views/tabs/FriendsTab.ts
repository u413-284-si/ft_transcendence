import { FriendManager } from "../../charts/FriendManager.js";
import { makeFriendsMatchStatsOptions } from "../../charts/friendsMatchStatsOptions.js";
import { makeFriendsWinRateOptions } from "../../charts/friendsWinRateOptions.js";
import { makeFriendsWinstreakOptions } from "../../charts/friendsWinstreakOptions.js";
import { renderChart } from "../../charts/utils.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { Header3 } from "../../components/Header3.js";
import { toaster } from "../../Toaster.js";
import { DashboardFriends, FriendStatsSeries } from "../../types/DataSeries.js";
import { getEl } from "../../utility.js";
import { AbstractTab } from "./AbstractTab.js";

export class FriendsTab extends AbstractTab {
  private dashboard: DashboardFriends;
  private username: string;
  private friendManager: FriendManager;

  constructor(dashboard: DashboardFriends, username: string) {
    super();
    this.dashboard = dashboard;
    this.username = username;
    this.friendManager = new FriendManager();
    this.friendManager.selectFriend(this.username);
    this.populateChartOptions();
  }

  getHTML(): string {
    return /* HTML */ ` <div id="tab-friends">
      <div class="w-full max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        ${Header1({
          text: i18next.t("statsView.dashboard"),
          id: "friends-dashboard-header",
          variant: "default"
        })}
        ${this.getDashboardHTML()}
      </div>
    </div>`;
  }

  getDashboardHTML(): string {
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

  async onShow(): Promise<void> {
    for (const chartId in this.chartOptions) {
      try {
        this.charts[chartId] = await renderChart(
          chartId,
          this.chartOptions[chartId]
        );
      } catch (error) {
        console.error(`Chart ${chartId} failed to initialize`, error);
        toaster.error(i18next.t("toast.chartError"));
      }
    }
    this.renderFriendSelector(this.dashboard.matchStats);
  }

  override onHide(): void {
    super.onHide();

    this.friendManager.deselectAllFriendsExcept(this.username);
  }

  private populateChartOptions(): void {
    const selectedFriends = this.friendManager.getSelectedFriends();
    const colors = this.friendManager.getColors();

    this.chartOptions = {
      "friends-winrate": makeFriendsWinRateOptions(
        this.dashboard.winRate,
        selectedFriends,
        colors
      ),
      "friends-match-stats": makeFriendsMatchStatsOptions(
        this.dashboard.matchStats,
        selectedFriends,
        colors
      ),
      "friends-winstreak": makeFriendsWinstreakOptions(
        this.dashboard.winstreak,
        selectedFriends,
        colors
      )
    };
  }

  renderFriendSelector(friends: FriendStatsSeries) {
    if (!this.friendManager) return new Error("FriendManager null");
    if (!friends || friends.length === 0) {
      console.warn("No friends to display");
      return;
    }
    const container = getEl("friend-selector");
    const selectedFriends = this.friendManager.getSelectedFriends();

    friends.forEach((friend) => {
      const btn = document.createElement("button");
      btn.innerText = friend.name;
      btn.dataset.friendName = friend.name;
      btn.className = selectedFriends.includes(friend.name)
        ? `w-full ${this.friendManager?.getColor(friend.name)} text-white p-2 m-1`
        : "w-full bg-grey text-black p-2 m-1";

      btn.onclick = () => this.toggleFriendSelection(friend.name, btn);
      container.appendChild(btn);
    });
  }

  toggleFriendSelection(friendName: string, button: HTMLButtonElement) {
    if (friendName === this.username) {
      toaster.warn(i18next.t("toast.cannotRemoveYourself"));
      return;
    }
    const selectedFriends = this.friendManager.getSelectedFriends();
    const isSelected = selectedFriends.includes(friendName);

    if (isSelected) {
      this.friendManager.deselectFriend(friendName);
    } else {
      if (selectedFriends.length < 4) {
        this.friendManager.selectFriend(friendName);
      } else {
        toaster.warn(i18next.t("toast.compareMaxThree"));
        return;
      }
    }
    this.updateFriendButton(button, friendName, !isSelected);
    this.updateFriendsCharts();
  }

  private updateFriendButton(
    button: HTMLButtonElement,
    friendName: string,
    isSelected: boolean
  ) {
    button.className = isSelected
      ? `w-full ${this.friendManager?.getColor(friendName)} text-white p-2 m-1`
      : "w-full bg-gray-200 text-black p-2 m-1";
  }

  updateFriendsCharts() {
    const selectedFriends = this.friendManager.getSelectedFriends();
    const colors = this.friendManager.getColors();

    const winrateOptions = makeFriendsWinRateOptions(
      this.dashboard.winRate,
      selectedFriends,
      colors
    );
    const matchStatsOptions = makeFriendsMatchStatsOptions(
      this.dashboard.matchStats,
      selectedFriends,
      colors
    );
    const winstreakOptions = makeFriendsWinstreakOptions(
      this.dashboard.winstreak,
      selectedFriends,
      colors
    );

    this.charts["friends-winrate"].updateOptions(winrateOptions);
    this.charts["friends-match-stats"].updateOptions(matchStatsOptions);
    this.charts["friends-winstreak"].updateOptions(winstreakOptions);
  }
}
