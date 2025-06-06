import { router } from "../routing/Router.js";
import { sanitizeHTML } from "../sanitize.js";
import { ApiError } from "../services/api.js";
import {
  deleteFriendRequest,
  getUserFriendRequests,
  acceptFriendRequest,
  createFriendRequest
} from "../services/friendsServices.js";
import { getUserByUsername } from "../services/userServices.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { FriendStatusChangeEvent } from "../types/FriendStatusChangeEvent.js";
import { escapeHTML, getEl, getInputEl } from "../utility.js";
import {
  clearInvalid,
  markInvalid,
  validateUsernameOrEmail
} from "../validate.js";
import AbstractView from "./AbstractView.js";

export default class FriendsView extends AbstractView {
  private friendRequests: FriendRequest[] = [];
  private controller = new AbortController();

  constructor() {
    super();
    this.setTitle("Friends");
  }

  getName(): string {
    return "friends";
  }

  async render(): Promise<void> {
    this.friendRequests = await getUserFriendRequests();
    this.updateHTML();
    this.addListeners();
  }

  private refreshFriendList(): void {
    const html = this.createFriendListHTML();
    const cleanHTML = sanitizeHTML(html);
    getEl("friend-list").innerHTML = cleanHTML;
    this.addFriendListListeners();
  }

  private refreshRequestList(): void {
    const html = this.createRequestListHTML();
    const cleanHTML = sanitizeHTML(html);
    getEl("request-list").innerHTML = cleanHTML;
    this.addRequestListListeners();
  }

  createHTML(): string {
    return /* HTML */ `
      <section>
        <div class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg" id="friend-list">
          ${this.createFriendListHTML()}
        </div>
      </section>

      <section>
        <div class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h1 class="text-2xl font-bold text-blue-900 mb-6">Add a Friend</h2>
          <div>
            <input
              id="username-input"
              type="text"
              placeholder="Exact username"
              class="w-full border border-gray-300 rounded px-3 py-3 text-blue-900 disabled:bg-gray-100 disabled:text-gray-500"
            />
            <span
              id="username-error"
              class="error-message text-red-600 text-sm mt-1 hidden"
            ></span>
          </div>
          <div id="button-container">
            <button
              id="send-request-btn"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send request
            </button>
            <span
              id="status-message"
              class="transition-opacity duration-500 opacity-0 text-green-600 text-sm mt-1"
            ></span>
          </div>
        </div>
      </section>

      <section>
        <div class="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg" id="request-list">
          ${this.createRequestListHTML()}
        </div>
      </section>
    `;
  }

  private createFriendListHTML(): string {
    const acceptedRequests = this.friendRequests.filter(
      (r) => r.status === "ACCEPTED"
    );

    let html = `<h1 class="text-2xl font-bold text-blue-900 mb-6">Your Friends</h1>`;

    if (acceptedRequests.length === 0) {
      html += /* HTML */ ` <p class="text-gray-500 italic">
        You have no friends yet 😢
      </p>`;
      return html;
    }

    html += `<ul class="space-y-4">`;

    for (const request of acceptedRequests) {
      const onlineStatusClass = request.isOnline
        ? "text-green-500"
        : "text-gray-400";
      const onlineStatusText = request.isOnline ? "Online" : "Offline";

      html += /* HTML */ `
        <li
          class="bg-blue-800 p-4 rounded shadow-md flex justify-between items-center"
          data-request-id="${request.id}"
          data-friend-id="${request.friendId}"
        >
          <span class="flex-1 truncate"
            >${escapeHTML(request.friendUsername)}</span
          >
          <div class="flex items-center space-x-4">
            <span class="online-status font-semibold ${onlineStatusClass}"
              >${onlineStatusText}</span
            >
            <button
              class="remove-friend-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

  private createRequestListHTML(): string {
    const incoming = this.friendRequests.filter(
      (r) => !r.sender && r.status === "PENDING"
    );
    const outgoing = this.friendRequests.filter(
      (r) => r.sender && r.status === "PENDING"
    );

    let html = `<h1 class="text-2xl font-bold text-blue-900 mb-6">Friend Requests</h1>`;

    // 🔹 Incoming Section
    html += `<div>
      <h2 class="text-xl font-bold text-blue-900 mb-2">Incoming Friend Requests</h2>`;

    if (incoming.length === 0) {
      html += `<p class="text-gray-500 italic">No incoming requests</p>`;
    } else {
      html += `<ul class="space-y-2">`;
      for (const request of incoming) {
        html += /* HTML */ `
          <li
            class="flex justify-between items-center border bg-blue-800 p-4 rounded shadow-md"
            data-request-id="${request.id}"
          >
            <span class="truncate">${escapeHTML(request.friendUsername)}</span>
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
      for (const request of outgoing) {
        html += /* HTML */ `
          <li
            class="flex justify-between items-center border bg-blue-800 p-4 rounded shadow-md"
            data-request-id="${request.id}"
          >
            <span class="truncate">${escapeHTML(request.friendUsername)}</span>
            <div class="space-x-2">
              <span class="text-gray-500 italic">Pending...</span>
              <button
                class="delete-request-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        `;
      }
      html += `</ul>`;
    }

    html += `</div>`;

    return html;
  }

  protected addListeners(): void {
    window.addEventListener(
      "friendStatusChange",
      this.handleFriendStatusChange,
      {
        signal: this.controller.signal
      }
    );

    getEl("send-request-btn").addEventListener(
      "click",
      this.handleSendRequestButton,
      {
        signal: this.controller.signal
      }
    );

    this.addFriendListListeners();
    this.addRequestListListeners();
  }

  private addFriendListListeners = () => {
    document.querySelectorAll(".remove-friend-btn").forEach((btn) => {
      btn.addEventListener(
        "click",
        async (event) => {
          await this.handleDeleteButton(
            event,
            "Are you sure you want to remove this friend?"
          );
          this.refreshFriendList();
        },
        {
          signal: this.controller.signal
        }
      );
    });
  };

  private addRequestListListeners = () => {
    document.querySelectorAll(".accept-btn").forEach((btn) => {
      btn.addEventListener("click", this.handleAcceptButton, {
        signal: this.controller.signal
      });
    });

    document.querySelectorAll(".decline-btn").forEach((btn) => {
      btn.addEventListener(
        "click",
        async (event) => {
          await this.handleDeleteButton(
            event,
            "Are you sure you want to decline this request?"
          );
          this.refreshRequestList();
        },
        {
          signal: this.controller.signal
        }
      );
    });

    document.querySelectorAll(".delete-request-btn").forEach((btn) => {
      btn.addEventListener(
        "click",
        async (event) => {
          await this.handleDeleteButton(
            event,
            "Are you sure you want to delete this request?"
          );
          this.refreshRequestList();
        },
        {
          signal: this.controller.signal
        }
      );
    });
  };

  private handleDeleteButton = async (event: Event, msg: string) => {
    try {
      const btn = event.currentTarget as HTMLButtonElement;
      const requestId = this.getRequestIdFromButton(btn);
      if (!confirm(msg)) return;
      const request = await deleteFriendRequest(requestId);
      this.removeFriendRequest(request.id);
    } catch (error) {
      router.handleError("Error in handleDeleteButton()", error);
    }
  };

  private handleAcceptButton = async (event: Event) => {
    try {
      const btn = event.currentTarget as HTMLButtonElement;
      const requestid = this.getRequestIdFromButton(btn);
      const request = await acceptFriendRequest(requestid);
      this.removeFriendRequest(request.id);
      this.addFriendRequest(request);
      this.refreshRequestList();
      this.refreshFriendList();
    } catch (error) {
      router.handleError("Error in handleAcceptButton()", error);
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

  private handleSendRequestButton = async (): Promise<void> => {
    const inputEl = getInputEl("username-input");
    const errorEl = getEl("username-error");

    clearInvalid(inputEl, errorEl);

    if (!validateUsernameOrEmail(inputEl, errorEl)) return;

    const username = inputEl.value.trim();

    try {
      const user = await getUserByUsername(username);

      if (user === null) {
        markInvalid("User not found.", inputEl, errorEl);
        return;
      }
      clearInvalid(inputEl, errorEl);

      const request = await createFriendRequest(user.id);
      this.removeFriendRequest(request.id);
      this.addFriendRequest(request);
      inputEl.value = "";
      this.refreshRequestList();
      if (request.status === "PENDING") {
        this.showStatusMessage("Successfully sent friend request");
      } else if (request.status === "ACCEPTED") {
        this.showStatusMessage("Added friend!");
        this.refreshFriendList();
      }
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

  private getRequestIdFromButton(btn: Element): number {
    const li = btn.closest("li");
    if (!li || !li.dataset.requestId) throw new Error("Missing request ID");
    return Number(li.dataset.requestId);
  }

  private addFriendRequest(request: FriendRequest): void {
    this.friendRequests.push(request);
  }

  private removeFriendRequest(requestId: number): void {
    this.friendRequests = this.friendRequests.filter((r) => r.id !== requestId);
  }

  private showStatusMessage(text: string) {
    const messageElement = getEl("status-message");
    if (!messageElement) return;

    messageElement.textContent = text;
    messageElement.classList.remove("opacity-0");
    messageElement.classList.add("opacity-100");

    // Hide it after 1 second
    setTimeout(() => {
      messageElement.classList.remove("opacity-100");
      messageElement.classList.add("opacity-0");
    }, 1000);
  }
}
