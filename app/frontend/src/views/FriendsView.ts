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
import { getEl, getInputEl } from "../utility.js";
import { clearInvalid, markInvalid, validateUsername } from "../validate.js";
import AbstractView from "./AbstractView.js";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { Form } from "../components/Form.js";
import { Span } from "../components/Span.js";
import { Header1 } from "../components/Header1.js";
import { FriendListItem } from "../components/FriendListItem.js";

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
        <div class="flex flex-col justify-center items-center gap-4 mb-12">
          ${Header1({
            text: "Your Friends",
            id: "friends-header",
            variant: "default"
          })}
          <div id="friend-list">${this.createFriendListHTML()}</div>
        </div>
      </section>

      <section>
        ${Form({
          children: [
            Header1({
              text: "Add a Friend",
              id: "send-request-header",
              variant: "default"
            }),
            Input({
              id: "username-input",
              type: "text",
              placeholder: "Exact username",
              label: "Username",
              errorId: "username-error"
            }),
            Button({
              id: "send-request-btn",
              text: "Send Friend Request",
              variant: "default",
              size: "md",
              type: "submit"
            }),
            Span({
              id: "status-message",
              className:
                "transition-opacity duration-500 opacity-0 text-green-600 text-sm mt-1",
              variant: "success"
            })
          ],
          id: "send-request-form"
        })}
      </section>

      <section>
        <div class="flex flex-col justify-center items-center gap-4 mb-12">
          ${Header1({
            text: "Friend Requests",
            id: "friends-request-header",
            variant: "default"
          })}
          <div id="request-list">${this.createRequestListHTML()}</div>
        </div>
      </section>
    `;
  }

  private createFriendListHTML(): string {
    const acceptedRequests = this.friendRequests.filter(
      (r) => r.status === "ACCEPTED"
    );

    let html = ``;

    if (acceptedRequests.length === 0) {
      html += /* HTML */ ` <p class="text-gray-500 italic">
        You have no friends yet 😢
      </p>`;
      return html;
    }

    html += `<ul class="space-y-4">`;

    for (const request of acceptedRequests) {
      html += FriendListItem(request, "friend");
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

    let html = ``;

    // 🔹 Incoming Section
    html += `<div>
      <h2 class="text-xl font-bold text-blue-900 mb-2">Incoming Friend Requests</h2>`;

    if (incoming.length === 0) {
      html += `<p class="text-gray-500 italic">No incoming requests</p>`;
    } else {
      html += `<ul class="space-y-2">`;
      for (const request of incoming) {
        html += FriendListItem(request, "incoming");
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
        html += FriendListItem(request, "outgoing");
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

    getEl("send-request-form").addEventListener(
      "submit",
      (event) => this.handleSendRequestButton(event),
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

  private handleSendRequestButton = async (event: Event): Promise<void> => {
    event.preventDefault();
    const inputEl = getInputEl("username-input");
    const errorEl = getEl("username-error");

    clearInvalid(inputEl, errorEl);

    if (!validateUsername(inputEl, errorEl)) return;

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
