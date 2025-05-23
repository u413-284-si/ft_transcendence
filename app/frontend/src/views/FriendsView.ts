import { getUserFriends } from "../services/friendsServices.js";
import { escapeHTML } from "../utility.js";
import AbstractView from "./AbstractView.js";

export default class FriendsView extends AbstractView {
  private friendsHTML: string = "";

  constructor() {
    super();
    this.setTitle("Friends");
  }

  getName(): string {
    return "friends";
  }

  async render(): Promise<void> {
    this.friendsHTML = await this.createFriendsHTML();
    this.updateHTML();
  }

  createHTML(): string {
    return /* HTML */ `
      <h1 class="text-2xl font-bold text-blue-300 mb-6">Your Friends</h1>
      <ul class="space-y-4">
        ${this.friendsHTML}
      </ul>
    `;
  }

  private async createFriendsHTML(): Promise<string> {
    const friends = await getUserFriends();
    if (friends.length === 0) {
      return /* HTML */ ` <h1 class="text-2xl mb-4">Friends</h1>
        <p>You have no friends yet 😢</p>`;
    }
    return `${friends
      .map(
        (friend) => `
            <li class="bg-blue-800 p-4 rounded shadow-md flex justify-between items-center">
              <span>${escapeHTML(friend.username)}</span>
            </li>
          `
      )
      .join("")}`;
  }
}
