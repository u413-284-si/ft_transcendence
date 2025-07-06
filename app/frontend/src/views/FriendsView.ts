import { router } from "../routing/Router.js";
import { sanitizeHTML } from "../sanitize.js";
import { ApiError } from "../services/api.js";
import {
  deleteFriendRequest,
  getUserFriendRequests,
  acceptFriendRequest,
  createFriendRequest,
  getUserFriendRequestByUsername
} from "../services/friendsServices.js";
import { getUserByUsername } from "../services/userServices.js";
import { FriendRequest } from "../types/FriendRequest.js";
import {
  FriendRequestEvent,
  FriendStatusChangeEvent
} from "../types/ServerSentEvents.js";
import { getEl, getInputEl } from "../utility.js";
import { clearInvalid, markInvalid, validateUsername } from "../validate.js";
import AbstractView from "./AbstractView.js";
import { Button } from "../components/Button.js";
import { Input } from "../components/Input.js";
import { Form } from "../components/Form.js";
import { Header1 } from "../components/Header1.js";
import { FriendListItem } from "../components/FriendListItem.js";
import { Header2 } from "../components/Header2.js";
import { toaster } from "../Toaster.js";

type RequestListType = "friend" | "incoming" | "outgoing";

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

  private refreshRequestList(type: RequestListType): void {
    const html = this.createRequestListHTML(type);
    const cleanHTML = sanitizeHTML(html);

    let containerId = "";

    switch (type) {
      case "friend":
        containerId = "friend-list";
        break;
      case "incoming":
        containerId = "request-list-in";
        break;
      case "outgoing":
        containerId = "request-list-out";
        break;
      default:
        throw new Error(`Unknown list type: ${type}`);
    }

    getEl(containerId).innerHTML = cleanHTML;
    this.addRequestListListeners(type);
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
          <div id="friend-list">${this.createRequestListHTML("friend")}</div>
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
            })
          ],
          id: "send-request-form"
        })}
      </section>

      <section>
        <div class="flex flex-col justify-center items-center gap-4">
          ${Header1({
            text: "Friend Requests",
            id: "friends-request-header",
            variant: "default"
          })}
          <div class="mb-4">
            ${Header2({
              text: "Incoming Friend Requests",
              variant: "default"
            })}
            <div id="request-list-in">
              ${this.createRequestListHTML("incoming")}
            </div>
          </div>
          <div>
            ${Header2({
              text: "Outgoing Friend Requests",
              variant: "default"
            })}
            <div id="request-list-out">
              ${this.createRequestListHTML("outgoing")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private createRequestListHTML(type: RequestListType): string {
    let filtered: FriendRequest[] = [];
    let emptyMessage = "";

    switch (type) {
      case "friend":
        filtered = this.friendRequests.filter((r) => r.status === "ACCEPTED");
        emptyMessage = "You have no friends yet";
        break;
      case "incoming":
        filtered = this.friendRequests.filter(
          (r) => r.status === "PENDING" && !r.sender
        );
        emptyMessage = "No incoming friend requests";
        break;
      case "outgoing":
        filtered = this.friendRequests.filter(
          (r) => r.status === "PENDING" && r.sender
        );
        emptyMessage = "No outgoing friend requests";
        break;
      default:
        throw new Error(`Unknown request list type: ${type}`);
    }

    if (filtered.length === 0) {
      return `<p class="text-grey">${emptyMessage}</p>`;
    }

    return `
    <ul class="space-y-4">
      ${filtered.map((r) => FriendListItem(r, type)).join("")}
    </ul>
  `;
  }

  protected addListeners(): void {
    window.addEventListener(
      "app:FriendStatusChangeEvent",
      this.handleFriendStatusChange,
      {
        signal: this.controller.signal
      }
    );

    window.addEventListener(
      "app:FriendRequestEvent",
      this.handleFriendRequestEvent,
      {
        signal: this.controller.signal
      }
    );

    window.addEventListener(
      "app:FriendRequestEvent",
      this.handleFriendRequestEvent,
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

    this.addRequestListListeners("friend");
    this.addRequestListListeners("incoming");
    this.addRequestListListeners("outgoing");
  }

  private addButtonListeners = (
    selector: string,
    confirmMessage: string | null,
    refreshTypes: RequestListType[] | null,
    handler: (event: Event) => Promise<void> | void
  ): void => {
    document.querySelectorAll(selector).forEach((btn) => {
      btn.addEventListener(
        "click",
        async (event) => {
          if (confirmMessage) {
            const confirmed = confirm(confirmMessage);
            if (!confirmed) return;
          }

          await handler(event);

          if (refreshTypes) {
            for (const type of refreshTypes) {
              this.refreshRequestList(type);
            }
          }
        },
        {
          signal: this.controller.signal
        }
      );
    });
  };

  private addRequestListListeners = (type: RequestListType) => {
    switch (type) {
      case "friend":
        this.addButtonListeners(
          ".remove-friend-btn",
          "Are you sure you want to remove this friend?",
          ["friend"],
          this.handleDeleteButton
        );
        break;

      case "incoming":
        this.addButtonListeners(
          ".accept-btn",
          null,
          ["incoming", "friend"],
          this.handleAcceptButton
        );
        this.addButtonListeners(
          ".decline-btn",
          "Are you sure you want to decline this request?",
          ["incoming"],
          this.handleDeleteButton
        );
        break;

      case "outgoing":
        this.addButtonListeners(
          ".delete-request-btn",
          "Are you sure you want to delete this request?",
          ["outgoing"],
          this.handleDeleteButton
        );
        break;
    }
  };

  private handleDeleteButton = async (event: Event) => {
    try {
      const btn = event.currentTarget as HTMLButtonElement;
      const requestId = this.getRequestIdFromButton(btn);
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
    } catch (error) {
      router.handleError("Error in handleAcceptButton()", error);
    }
  };

  private handleFriendStatusChange = (event: Event) => {
    const customEvent = event as FriendStatusChangeEvent;
    const { requestId, isOnline } = customEvent.detail;
    const container = document.querySelector<HTMLElement>(
      `li[data-request-id="${requestId}"]`
    );
    if (!container) {
      console.warn("Tried to update status, but container not found");
      return;
    }
    const statusSpan = container.querySelector(".online-status")!;

    statusSpan.textContent = isOnline ? "Online" : "Offline";
    statusSpan.classList.toggle("text-neon-green", isOnline);
    statusSpan.classList.toggle("text-grey", !isOnline);
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
      this.refreshRequestList("outgoing");
      if (request.status === "PENDING") {
        toaster.success(`Sent friend request to ${username}`);
      } else if (request.status === "ACCEPTED") {
        toaster.success(`Accepted friend request of ${username}`, "❤️");
        this.refreshRequestList("incoming");
        this.refreshRequestList("friend");
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

  private getFriendRequest(requestId: number): FriendRequest {
    const request = this.friendRequests.find((r) => r.id === requestId);
    if (!request) throw new Error(`Did not find request with id ${requestId}`);
    return request;
  }
  private addFriendRequest(request: FriendRequest): void {
    this.friendRequests.push(request);
  }

  private removeFriendRequest(requestId: number): void {
    this.friendRequests = this.friendRequests.filter((r) => r.id !== requestId);
  }

  private handleFriendRequestEvent = async (event: Event) => {
    try {
      const customEvent = event as FriendRequestEvent;
      const { requestId, username, status } = customEvent.detail;
      switch (status) {
        case "PENDING": {
          const request = await getUserFriendRequestByUsername(username);
          if (request) {
            this.addFriendRequest(request);
            this.refreshRequestList("incoming");
          }
          break;
        }
        case "ACCEPTED": {
          const request = await getUserFriendRequestByUsername(username);
          if (request) {
            this.removeFriendRequest(requestId);
            this.addFriendRequest(request);
            this.refreshRequestList("friend");
            this.refreshRequestList("outgoing");
          }
          break;
        }
        case "DECLINED": {
          this.removeFriendRequest(requestId);
          this.refreshRequestList("outgoing");
          break;
        }
        case "RESCINDED": {
          this.removeFriendRequest(requestId);
          this.refreshRequestList("incoming");
          break;
        }
        case "DELETED": {
          this.removeFriendRequest(requestId);
          this.refreshRequestList("friend");
          break;
        }
      }
    } catch (error) {
      router.handleError("Error in handleFriendRequestEvent()", error);
    }
  };
}
