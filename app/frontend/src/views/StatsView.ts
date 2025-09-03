import AbstractView from "./AbstractView.js";
import {
  getUserStats,
  getUserStatsByUsername
} from "../services/userStatsServices.js";
import { getUserByUsername } from "../services/userServices.js";
import { escapeHTML, getAllBySelector, getById } from "../utility.js";
import { auth } from "../AuthManager.js";
import { Header1 } from "../components/Header1.js";
import { router } from "../routing/Router.js";
import { getUserFriendRequestByUsername } from "../services/friendsServices.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { User } from "../types/User.js";
import { UserStats } from "../types/IUserStats.js";
import { Paragraph } from "../components/Paragraph.js";
import { StatFieldGroup } from "../components/StatField.js";
import { getDataOrThrow } from "../services/api.js";
import { formatDate } from "../formatDate.js";
import { AbstractTab } from "./tabs/AbstractTab.js";
import { TextBox } from "../components/TextBox.js";
import { TabButton } from "../components/TabButton.js";
import { MatchesTab } from "./tabs/MatchesTab.js";
import { TournamentsTab } from "./tabs/TournamentsTab.js";
import { FriendsTab } from "./tabs/FriendsTab.js";
import { toaster } from "../Toaster.js";

export default class StatsView extends AbstractView {
  private viewType: "self" | "friend" | "public" = "public";
  private username = escapeHTML(router.getParams().username);
  private user: User | null = null;
  private userStats: UserStats | null = null;
  private friendRequest: FriendRequest | null = null;
  private tabs: Record<string, AbstractTab> = {};
  private currentTabId?: string;

  constructor() {
    super();
    this.setTitle(i18next.t("statsView.title"));
  }

  createHTML() {
    if (!this.user) throw new Error(i18next.t("error.somethingWentWrong"));
    if (!this.userStats) throw new Error(i18next.t("error.somethingWentWrong"));

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
              text: `${i18next.t("statsView.joined", {
                date: formatDate(this.user.dateJoined)
              })}`
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
              value: `${this.userStats?.winstreakCur}`,
              text: i18next.t("statsView.winstreakCur")
            },
            {
              value: `${this.userStats?.winstreakMax}`,
              text: i18next.t("statsView.winstreakMax")
            }
          ])}
        </div>
      </div>
      ${this.getTabsHTML()} `;
  }

  async render() {
    await this.setViewType();
    await this.fetchData();
    this.initTabs();
    this.updateHTML();
    await this.showTab("tab-matches");
    this.addListeners();
  }

  private initTabs() {
    if (this.viewType === "public") return;
    this.tabs["tab-matches"] = new MatchesTab(this.userStats!, this.username);
    this.tabs["tab-tournaments"] = new TournamentsTab(this.username);
    if (this.viewType !== "self") return;
    this.tabs["tab-friends"] = new FriendsTab(this.username);
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
      return;
    }
    const userStatsArray = getDataOrThrow(
      await getUserStatsByUsername(this.username)
    );
    if (!userStatsArray[0])
      throw new Error(i18next.t("error.userStatsNotFound"));
    this.userStats = userStatsArray[0];
  }

  async showTab(tabId: string) {
    try {
      if (this.currentTabId) {
        this.tabs[this.currentTabId].onHide();
        const container = getById<HTMLDivElement>(this.currentTabId);
        container.classList.toggle("hidden");
      }

      this.currentTabId = tabId;
      const container = getById<HTMLDivElement>(this.currentTabId);
      container.classList.toggle("hidden");

      await this.tabs[tabId].onShow();
    } catch (error) {
      console.error(`Error while showing tab ${this.currentTabId}`, error);
      toaster.error(i18next.t("toast.tabError"));
    }
  }

  getTabsHTML(): string {
    if (this.viewType === "public") {
      return /* HTML */ ` ${TextBox({
        text: [i18next.t("statsView.friendOnly")],
        variant: "info"
      })}`;
    }

    let allTabsHTML = "";
    for (const tabId in this.tabs) {
      allTabsHTML += this.tabs[tabId].getHTML();
    }

    return /* HTML */ `
      <div class="flex space-x-4 border-b border-grey mb-4">
        ${TabButton({
          text: i18next.t("statsView.matches"),
          tabId: "tab-matches",
          isActive: true
        })}
        ${TabButton({
          text: i18next.t("statsView.tournaments"),
          tabId: "tab-tournaments"
        })}
        ${this.viewType === "self"
          ? TabButton({
              text: i18next.t("statsView.friends"),
              tabId: "tab-friends"
            })
          : ""}
      </div>
      <div id="tab-content">${allTabsHTML}</div>
    `;
  }

  protected addListeners(): void {
    const buttons = getAllBySelector<HTMLButtonElement>(".tab-button");

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const tabId = button.dataset.tab!;
        await this.showTab(tabId);

        buttons.forEach((btn) => {
          btn.classList.remove("active-link");
        });

        button.classList.add("active-link");
      });
    });
  }

  unmount(): void {
    console.log("Cleaning up StatsView");
    for (const tabId in this.tabs) {
      const tab = this.tabs[tabId];
      if (tab) {
        tab.destroyCharts();
      }
    }
  }
}
