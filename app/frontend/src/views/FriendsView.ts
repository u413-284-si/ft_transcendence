import { ApiError } from "../services/api.js";
import {
  deleteFriend,
  getUserFriendRequests,
  getUserFriends,
  respondToFriendRequest,
  sendFriendRequest
} from "../services/friendsServices.js";
import { getUserByUsername } from "../services/userServices.js";
import { FriendStatusChangeEvent } from "../types/FriendStatusChangeEvent.js";
import { escapeHTML } from "../utility.js";
import {
  clearInvalid,
  markInvalid,
  validateUsernameOrEmail
} from "../validate.js";
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
    this.refreshPendingRequestView();
  }

  createHTML(): string {
    return /* HTML */ `
      <section>
        <div class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h1 class="text-2xl font-bold text-blue-900 mb-6">Your Friends</h1>
          ${this.friendsHTML}
        </div>
      </section>

      <section>
        <div class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold text-blue-900 mb-6">Add a Friend</h2>
          <div>
            <input
              id="username-input"
              type="text"
              placeholder="Exact username"
              class="w-full border border-gray-300 rounded px-3 py-3 text-blue-900 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <span
              id="error"
              class="error-message text-red-600 text-sm mt-1 hidden"
            ></span>
          </div>
          <div id="button-container">
            <button
              id="request-btn"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send request
            </button>
          </div>
        </div>
      </section>

      <section>
        <div
          id="pending-requests"
          class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg"
        >
          <div>
            <h2 class="text-xl font-bold text-blue-900 mb-2">
              Incoming Friend Requests
            </h2>
            <ul id="incoming-requests" class="space-y-2"></ul>
          </div>
          <div>
            <h2 class="text-xl font-bold text-blue-900 mb-2">
              Outgoing Friend Requests
            </h2>
            <ul id="outgoing-requests" class="space-y-2"></ul>
          </div>
        </div>
      </section>
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

  async createPendingRequestsHTML(): Promise<string> {
    try {
      const requests = await getUserFriendRequests();

      const incoming = requests.filter(
        (r) => !r.sender && r.status === "PENDING"
      );
      const outgoing = requests.filter(
        (r) => r.sender && r.status === "PENDING"
      );

      let html = "";

      // 🔹 Incoming Section
      html += `<div>
      <h2 class="text-xl font-bold text-blue-900 mb-2">Incoming Friend Requests</h2>`;

      if (incoming.length === 0) {
        html += `<p class="text-gray-500 italic">No incoming requests</p>`;
      } else {
        html += `<ul class="space-y-2">`;
        for (const req of incoming) {
          html += /* HTML */ `
            <li
              class="flex justify-between items-center border bg-blue-800 p-4 rounded shadow-md"
              data-request-id="${req.id}"
            >
              <span class="truncate">${escapeHTML(req.friendUsername)}</span>
              <div class="space-x-2">
                <button
                  class="accept-btn bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  class="decline-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </li>
          `;
        }
        html += `</ul>`;
      }

      html += `</div>`;

      // 🔹 Outgoing Section
      html += `<div class="mt-8">
      <h2 class="text-xl font-bold text-blue-900 mb-2">Outgoing Friend Requests</h2>`;

      if (outgoing.length === 0) {
        html += `<p class="text-gray-500 italic">No outgoing requests</p>`;
      } else {
        html += `<ul class="space-y-2">`;
        for (const req of outgoing) {
          html += /* HTML */ `
            <li
              class="flex justify-between items-center border bg-blue-800 p-4 rounded shadow-md"
              data-request-id="${req.id}"
            >
              <span class="truncate">${escapeHTML(req.friendUsername)}</span>
              <span class="text-gray-500 italic">Pending...</span>
            </li>
          `;
        }
        html += `</ul>`;
      }

      html += `</div>`;

      return html;
    } catch (err) {
      console.error("Failed to load pending requests:", err);
      return `<p class="text-red-600">Could not load pending friend requests.</p>`;
    }
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
    document
      .getElementById("request-btn")!
      .addEventListener("click", this.handleFriendRequest, {
        signal: this.controller.signal
      });
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

  private handleFriendRequest = async (): Promise<void> => {
    const inputEl = document.getElementById(
      "username-input"
    ) as HTMLInputElement;
    const errorEl = document.getElementById("error")!;
    const buttonContainer = document.getElementById("button-container")!;

    clearInvalid(inputEl, errorEl);

    if (!validateUsernameOrEmail(inputEl, errorEl)) return;

    const username = inputEl.value.trim();
    inputEl.disabled = true;

    try {
      const user = await getUserByUsername(username);

      if (user === null) {
        markInvalid("User not found.", inputEl, errorEl);
        inputEl.disabled = false;
        return;
      }
      clearInvalid(inputEl, errorEl);

      await sendFriendRequest(user.id);

      buttonContainer.innerHTML = /* HTML */ `
        <p class="text-green-600 font-semibold mb-2">Friend request sent!</p>
        <button
          id="new-request-btn"
          class="bg-gray-300 text-blue-900 px-4 py-2 rounded hover:bg-gray-400"
        >
          Send another request
        </button>
      `;

      const newBtn = document.getElementById("new-request-btn")!;
      newBtn.addEventListener("click", () => {
        clearInvalid(inputEl, errorEl);
        inputEl.value = "";
        inputEl.disabled = false;

        buttonContainer.innerHTML = /* HTML */ `
          <button
            id="request-btn"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send request
          </button>
        `;

        const newRequestBtn = document.getElementById("request-btn")!;
        newRequestBtn.addEventListener("click", () =>
          this.handleFriendRequest()
        );
      });
    } catch (error) {
      console.error(error);
      let message = "Something went wrong.";
      if (error instanceof ApiError) {
        message = error.cause ? error.cause : error.message;
      }
      markInvalid(`${message}`, inputEl, errorEl);
      inputEl.disabled = false;
    }
  };

  unmount(): void {
    console.log("Cleaning up FriendsView");
    this.controller.abort();
  }

  bindFriendRequestButtons = (): void => {
    document.querySelectorAll(".accept-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = this.getRequestIdFromButton(btn);
        await respondToFriendRequest(id, true);
        await this.refreshPendingRequestView();
      });
    });

    document.querySelectorAll(".decline-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = this.getRequestIdFromButton(btn);
        await respondToFriendRequest(id, false);
        await this.refreshPendingRequestView();
      });
    });
  };

  getRequestIdFromButton(btn: Element): number {
    const li = btn.closest("li");
    if (!li || !li.dataset.requestId) throw new Error("Missing request ID");
    return Number(li.dataset.requestId);
  }

  refreshPendingRequestView = async () => {
    const container = document.getElementById("pending-requests")!;
    container.innerHTML = await this.createPendingRequestsHTML();
    this.bindFriendRequestButtons();
  };
}
