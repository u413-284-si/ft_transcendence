import { friendsColors } from "./chartUtils.js";

const friendsTwClassesSelected = [
  "border border-neon-cyan bg-neon-cyan",
  "border border-neon-yellow bg-neon-yellow",
  "border border-neon-purple bg-neon-purple",
  "border border-neon-green bg-neon-green",
  "border border-grey bg-grey"
];

const friendsTwClassesNotSelected = [
  "border border-grey hover:bg-neon-cyan",
  "border border-grey hover:bg-neon-yellow",
  "border border-grey hover:bg-neon-purple",
  "border border-grey hover:bg-neon-green",
  "border border-grey"
];

export class FriendManager {
  private friendColorMap: Map<string, number> = new Map();
  private selectedFriends: string[] = [];
  private readonly colors: string[] = friendsColors;
  private readonly twColorsSelected: string[] = friendsTwClassesSelected;
  private readonly twColorsNotSelected: string[] = friendsTwClassesNotSelected;

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

  getColors(): string[] {
    return this.selectedFriends.map((friend) => {
      const index = this.friendColorMap.get(friend);
      if (index === undefined) {
        console.error(`No color for ${friend}`);
        return "grey";
      }
      return this.colors[index];
    });
  }

  getColor(friend: string): string {
    const index = this.friendColorMap.get(friend);
    if (index === undefined) {
      console.error(`No color for ${friend}`);
      return "grey";
    }
    return this.twColorsSelected[index];
  }

  getNextColor(): string {
    const index = this.getNextAvailableColorIndex();
    return this.twColorsNotSelected[index];
  }
}
