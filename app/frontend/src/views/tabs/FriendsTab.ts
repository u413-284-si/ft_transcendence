import { FriendManager } from "../../charts/FriendManager.js";
import { buildFriendsMatchStatsOptions } from "../../charts/friendsMatchStatsOptions.js";
import { buildFriendsWinRateOptions } from "../../charts/friendsWinRateOptions.js";
import { buildFriendsWinstreakOptions } from "../../charts/friendsWinStreakOptions.js";
import { Chart } from "../../components/Chart.js";
import { Header1 } from "../../components/Header1.js";
import { getDataOrThrow } from "../../services/api.js";
import { getUserDashboardFriends } from "../../services/userStatsServices.js";
import { toaster } from "../../Toaster.js";
import { DashboardFriends, FriendStatsSeries } from "../../types/DataSeries.js";
import { getById } from "../../utility.js";
import { AbstractTab } from "./AbstractTab.js";

export class FriendsTab extends AbstractTab {
  private dashboard: DashboardFriends | null = null;
  private username: string;
  private friendManager: FriendManager;

  constructor(username: string) {
    super();
    this.username = username;
    this.friendManager = new FriendManager();
    this.friendManager.selectFriend(this.username);
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
        ${Chart({
          title: i18next.t("chart.selectUpTo"),
          chartId: "friend-selector",
          chartClassName:
            "h-[300px] w-[450px] flex flex-col gap-2 overflow-scroll px-3"
        })}
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
          title: i18next.t("statsView.winstreakCur"),
          chartId: "friends-winstreak"
        })}
      </div>
    </div> `;
  }

  override async onShow(): Promise<void> {
    await super.onShow();
    this.renderFriendSelector(this.dashboard!.matchStats);
  }

  async init(): Promise<void> {
    this.dashboard = getDataOrThrow(await getUserDashboardFriends());
    this.populateChartOptions();
    this.isInit = true;
  }

  override onHide(): void {
    super.onHide();

    this.friendManager.deselectAllFriendsExcept(this.username);
  }

  private populateChartOptions(): void {
    if (!this.dashboard) throw new Error(i18next.t("error.somethingWentWrong"));

    const filtered = this.friendManager.getFilteredSeries(this.dashboard);

    this.chartOptions = {
      "friends-winrate": buildFriendsWinRateOptions(filtered.winRate),
      "friends-match-stats": buildFriendsMatchStatsOptions(filtered.matchStats),
      "friends-winstreak": buildFriendsWinstreakOptions(filtered.winStreak)
    };
  }

  renderFriendSelector(friends: FriendStatsSeries) {
    if (!friends || friends.length === 0) {
      console.warn("No friends to display");
      return;
    }
    const container = getById<HTMLDivElement>("friend-selector");
    const selectedFriends = this.friendManager.getSelectedFriends();

    friends.forEach((friend) => {
      const btn = document.createElement("button");
      btn.innerText = friend.name;
      const isSelected = selectedFriends.includes(friend.name);
      btn.dataset.selected = isSelected ? "true" : "false";
      btn.className = isSelected
        ? `${this.friendManager.getBtnClassesSelected(friend.name)}`
        : `${this.friendManager?.getBtnClassesNotSelected()}`;

      btn.onclick = () => this.toggleFriendSelection(friend.name, btn);
      container.appendChild(btn);
    });
  }

  toggleFriendSelection(friendName: string, button: HTMLButtonElement) {
    if (friendName === this.username) {
      toaster.warn(i18next.t("toast.chartCannotRemoveYourself"));
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
        toaster.warn(i18next.t("toast.chartCompareMaxThree"));
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
    if (isSelected) {
      button.className = `${this.friendManager?.getBtnClassesSelected(friendName)}`;
      button.dataset.selected = "true";
    } else {
      button.dataset.selected = "false";
    }
    const container = getById<HTMLDivElement>("friend-selector");
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      const selected = btn.dataset.selected === "true";
      if (!selected) {
        btn.className = `${this.friendManager?.getBtnClassesNotSelected()}`;
      }
    });
  }

  updateFriendsCharts() {
    if (!this.dashboard) throw new Error(i18next.t("error.somethingWentWrong"));

    const filtered = this.friendManager.getFilteredSeries(this.dashboard);

    this.charts["friends-winrate"].updateSeries(filtered.winRate);
    this.charts["friends-match-stats"].updateSeries(filtered.matchStats);
    this.charts["friends-winstreak"].updateSeries(filtered.winStreak);
  }
}
