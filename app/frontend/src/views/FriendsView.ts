import { deleteFriend, getUserFriends } from "../services/friendsServices.js";
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
    this.addListeners();
  }

  createHTML(): string {
    return /* HTML */ `
      <div class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold text-blue-900 mb-6">Your Friends</h1>
        ${this.friendsHTML}
      </div>
    `;
  }

  private async createFriendsHTML(): Promise<string> {
    const friends = await getUserFriends();
    if (friends.length === 0) {
      return /* HTML */ ` <p>You have no friends yet 😢</p>`;
    }
    return /* HTML */ ` <ul class="space-y-4">
      ${friends
        .map(
          (friend) => `
          <li
            class="bg-blue-800 p-4 rounded shadow-md flex justify-between items-center"
          >
            <span>${escapeHTML(friend.username)}</span>
            <button
              class="remove-friend-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              data-friend-id="${friend.id}"
            >
              Remove
            </button>
          </li>
        `
        )
        .join("")}
    </ul>`;
  }

  protected addListeners(): void {
    document.querySelectorAll(".remove-friend-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const friendId = Number(target.dataset.friendId);
        if (!isNaN(friendId)) {
          try {
            await deleteFriend(friendId);
            await this.render();
          } catch (error) {
            console.error("Failed to remove friend:", error);
          }
        }
      });
    });
  }
}
