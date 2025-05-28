import { deleteFriend, getUserFriends } from "../services/friendsServices.js";
import { FriendStatusChangeEvent } from "../types/FriendStatusChangeEvent.js";
import { escapeHTML } from "../utility.js";
import AbstractView from "./AbstractView.js";

export default class FriendsView extends AbstractView {
  private friendsHTML: string = "";
  private controller = new AbortController();

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

    let html = `<ul class="space-y-4">`;

    for (const friend of friends) {
      const onlineStatusClass = friend.isOnline
        ? "text-green-500"
        : "text-gray-400";
      const onlineStatusText = friend.isOnline ? "Online" : "Offline";

      html += /* HTML */ `
        <li
          class="bg-blue-800 p-4 rounded shadow-md flex justify-between items-center"
          data-friend-id="${friend.id}"
        >
          <span class="flex-1 truncate">${escapeHTML(friend.username)}</span>
          <div class="flex items-center space-x-4">
            <span class="online-status font-semibold ${onlineStatusClass}"
              >${onlineStatusText}</span
            >
            <button
              class="remove-friend-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        </li>
      `;
    }

    html += `</ul>`;
    return html;
  }

  protected addListeners(): void {
    document.querySelectorAll(".remove-friend-btn").forEach((btn) => {
      btn.addEventListener("click", this.handleDeleteButton, {
        signal: this.controller.signal
      });
    });
    window.addEventListener(
      "friendStatusChange",
      this.handleFriendStatusChange,
      {
        signal: this.controller.signal
      }
    );
  }

  private handleDeleteButton = async (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement;
    const container = target.closest<HTMLElement>("[data-friend-id]");
    if (!container) {
      console.warn("Tried to delete, but container not found");
      return;
    }
    const friendId = Number(container.dataset.friendId);
    if (!isNaN(friendId)) {
      try {
        await deleteFriend(friendId);
        await this.render();
      } catch (error) {
        console.error("Failed to remove friend:", error);
      }
    }
  };

  private handleFriendStatusChange = (event: Event) => {
    const customEvent = event as FriendStatusChangeEvent;
    const { userId, isOnline } = customEvent.detail;
    const container = document.querySelector<HTMLElement>(
      `li[data-friend-id="${userId}"]`
    );
    if (!container) {
      console.warn("Tried to update status, but container not found");
      return;
    }
    const statusSpan = container.querySelector(".online-status")!;

    statusSpan.textContent = isOnline ? "Online" : "Offline";
    statusSpan.classList.toggle("text-green-500", isOnline);
    statusSpan.classList.toggle("text-gray-400", !isOnline);
  };

  unmount(): void {
    console.log("Cleaning up FriendsView");
    this.controller.abort();
  }
}
