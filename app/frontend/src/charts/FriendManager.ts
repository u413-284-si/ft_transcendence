import { friendsColors, friendsColorsTailwind } from "./chartUtils.js";

export class FriendManager {
  private friendColorMap: Map<string, number> = new Map();
  private selectedFriends: string[] = [];
  private readonly colors: string[] = friendsColors;
  private readonly tailwindColors: string[] = friendsColorsTailwind;

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
    return this.tailwindColors[index];
  }
}
