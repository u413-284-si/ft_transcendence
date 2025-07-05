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
import { Header2 } from "../components/Header2.js";

type RequestListType = "friend" | "incoming" | "outgoing";

export default class FriendsView extends AbstractView {
  private friendRequests: FriendRequest[] = [];
  private controller = new AbortController();

  constructor() {
    super();
    this.setTitle(i18next.t("friends"));
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
            text: i18next.t("yourFriends"),
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
              text: i18next.t("addFriend"),
              id: "send-request-header",
              variant: "default"
            }),
            Input({
              id: "username-input",
              type: "text",
              placeholder: i18next.t("exactUsername"),
              label: i18next.t("usernameLabel"),
              errorId: "username-error"
            }),
            Button({
              id: "send-request-btn",
              text: i18next.t("sendFriendRequest"),
              variant: "default",
              size: "md",
              type: "submit"
            }),
            Span({
              id: "status-message",
              className: "transition-opacity duration-500 opacity-0",
              variant: "success"
            })
          ],
          id: "send-request-form"
        })}
      </section>

      <section>
        <div class="flex flex-col justify-center items-center gap-4">
          ${Header1({
            text: i18next.t("friendRequests"),
            id: "friends-request-header",
            variant: "default"
          })}
          <div class="mb-4">
            ${Header2({
              text: i18next.t("incomingRequests"),
              variant: "default"
            })}
            <div id="request-list-in">
              ${this.createRequestListHTML("incoming")}
            </div>
          </div>
          <div>
            ${Header2({
              text: i18next.t("outgoingRequests"),
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
        emptyMessage = i18next.t("noFriends");
        break;
      case "incoming":
        filtered = this.friendRequests.filter(
          (r) => r.status === "PENDING" && !r.sender
        );
        emptyMessage = i18next.t("noIncoming");
        break;
      case "outgoing":
        filtered = this.friendRequests.filter(
          (r) => r.status === "PENDING" && r.sender
        );
        emptyMessage = i18next.t("noOutgoing");
        break;
      default:
        throw new Error(i18next.t("unknownRequestListType", { type }));
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
          i18next.t("confirmRemoveFriend"),
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
          i18next.t("confirmDeclineRequest"),
          ["incoming"],
          this.handleDeleteButton
        );
        break;

      case "outgoing":
        this.addButtonListeners(
          ".delete-request-btn",
          i18next.t("confirmDeleteRequest"),
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
    const { userId, isOnline } = customEvent.detail;
    const container = document.querySelector<HTMLElement>(
      `li[data-friend-id="${userId}"]`
    );
    if (!container) {
      console.warn("Tried to update status, but container not found");
      return;
    }
    const statusSpan = container.querySelector(".online-status")!;

    statusSpan.textContent = isOnline ? i18next.t("online") : i18next.t("offline");
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
        markInvalid(i18next.t("userNotFound"), inputEl, errorEl);
        return;
      }
      clearInvalid(inputEl, errorEl);

      const request = await createFriendRequest(user.id);
      this.removeFriendRequest(request.id);
      this.addFriendRequest(request);
      inputEl.value = "";
      this.refreshRequestList("outgoing");
      if (request.status === "PENDING") {
        this.showStatusMessage(i18next.t("sendSuccess"));
      } else if (request.status === "ACCEPTED") {
        this.showStatusMessage(i18next.t("friendAdded"));
        this.refreshRequestList("friend");
      }
    } catch (error) {
      console.error(error);
      let message = i18next.t("somethingWentWrong");
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
