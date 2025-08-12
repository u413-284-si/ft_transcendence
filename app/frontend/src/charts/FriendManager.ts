import { DashboardFriends, FriendStatsSeries } from "../types/DataSeries.js";
import { friendsColors } from "./chartUtils.js";

const btnBaseClasses = "w-full p-2 text-white";

const btnSelected = [
  " border border-neon-cyan bg-neon-cyan",
  "border border-neon-yellow bg-neon-yellow",
  "border border-neon-purple bg-neon-purple",
  "border border-neon-green bg-neon-green",
  "border border-grey bg-grey"
];

const btnNotSelected = [
  "border border-grey hover:bg-neon-cyan",
  "border border-grey hover:bg-neon-yellow",
  "border border-grey hover:bg-neon-purple",
  "border border-grey hover:bg-neon-green",
  "border border-grey bg-grey/40"
];

export class FriendManager {
  private friendColorMap: Map<string, number> = new Map();
  private selectedFriends: string[] = [];
  private readonly colors: string[] = friendsColors;

  constructor() {}

  private getNextAvailableColorIndex(): number {
    const used = new Set(this.friendColorMap.values());
    for (let i = 0; i < this.colors.length; i++) {
      if (!used.has(i)) {
        return i;
      }
    }
    throw new Error("No available colors left!");
  }

  private getColor(friend: string): string {
    const index = this.friendColorMap.get(friend);
    if (index === undefined) {
      console.error(`No color for ${friend}`);
      return "grey";
    }
    return this.colors[index];
  }

  private filterSeriesAndAddColor(
    series: FriendStatsSeries
  ): ApexAxisChartSeries {
    return this.selectedFriends
      .map((name) => series.find((friend) => friend.name === name))
      .filter((friend): friend is FriendStatsSeries[number] => Boolean(friend))
      .map((series) => ({
        ...series,
        color: this.getColor(series.name)
      }));
  }

  selectFriend(friend: string): void {
    if (!this.selectedFriends.includes(friend)) {
      this.selectedFriends.push(friend);

      if (!this.friendColorMap.has(friend)) {
        const nextIndex = this.getNextAvailableColorIndex();
        this.friendColorMap.set(friend, nextIndex);
      }
    }
  }

  deselectFriend(friend: string): void {
    this.selectedFriends = this.selectedFriends.filter((f) => f !== friend);
    this.friendColorMap.delete(friend);
  }

  deselectAllFriendsExcept(currentUser: string): void {
    for (const friend of [...this.selectedFriends]) {
      if (friend !== currentUser) {
        this.deselectFriend(friend);
      }
    }
  }

  getSelectedFriends(): string[] {
    return this.selectedFriends;
  }

  getBtnClassesSelected(friend: string): string {
    const index = this.friendColorMap.get(friend);
    if (index === undefined) {
      console.error(`No classes for ${friend}`);
      return "grey";
    }
    return `${btnBaseClasses} ${btnSelected[index]}`;
  }

  getBtnClassesNotSelected(): string {
    const index = this.getNextAvailableColorIndex();
    return `${btnBaseClasses} ${btnNotSelected[index]}`;
  }

  getFilteredSeries(dashboard: DashboardFriends): {
    matchStats: ApexAxisChartSeries;
    winRate: ApexAxisChartSeries;
    winStreak: ApexAxisChartSeries;
  } {
    return {
      matchStats: this.filterSeriesAndAddColor(dashboard.matchStats),
      winRate: this.filterSeriesAndAddColor(dashboard.winRate),
      winStreak: this.filterSeriesAndAddColor(dashboard.winStreak)
    };
  }
}
