import { router } from "../routing/Router.js";
import { sanitizeHTML } from "../sanitize.js";
import { getDataOrThrow } from "../services/api.js";
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
import { escapeHTML, getEl, getInputEl } from "../utility.js";
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
    this.setTitle(i18next.t("friendsView.title"));
  }

  getName(): string {
    return "friends";
  }

  async render(): Promise<void> {
    this.friendRequests = getDataOrThrow(await getUserFriendRequests());
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
        throw new Error(
          i18next.t("error.unknownRequestListType", { type: type })
        );
    }

    getEl(containerId).innerHTML = cleanHTML;
    this.addRequestListListeners(type);
  }

  createHTML(): string {
    return /* HTML */ `
      <section>
        <div class="flex flex-col justify-center items-center gap-4 mb-12">
          ${Header1({
            text: i18next.t("friendsView.yourFriends"),
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
              text: i18next.t("friendsView.addFriend"),
              id: "send-request-header",
              variant: "default"
            }),
            Input({
              id: "username-input",
              type: "text",
              placeholder: i18next.t("friendsView.exactUsername"),
              label: i18next.t("global.username"),
              errorId: "username-error"
            }),
            Button({
              id: "send-request-btn",
              text: i18next.t("friendsView.sendFriendRequest"),
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
            text: i18next.t("friendsView.friendRequests"),
            id: "friends-request-header",
            variant: "default"
          })}
          <div class="mb-4">
            ${Header2({
              text: i18next.t("friendsView.incomingRequests"),
              variant: "default"
            })}
            <div id="request-list-in">
              ${this.createRequestListHTML("incoming")}
            </div>
          </div>
          <div>
            ${Header2({
              text: i18next.t("friendsView.outgoingRequests"),
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
        emptyMessage = i18next.t("friendsView.noFriends");
        break;
      case "incoming":
        filtered = this.friendRequests.filter(
          (r) => r.status === "PENDING" && !r.sender
        );
        emptyMessage = i18next.t("friendsView.noIncoming");
        break;
      case "outgoing":
        filtered = this.friendRequests.filter(
          (r) => r.status === "PENDING" && r.sender
        );
        emptyMessage = i18next.t("friendsView.noOutgoing");
        break;
      default:
        throw new Error(
          i18next.t("error.unknownRequestListType", { type: type })
        );
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
    handler: (event: Event) => Promise<string>,
    toastMessage: string,
    toastIcon?: string
  ): void => {
    document.querySelectorAll(selector).forEach((btn) => {
      btn.addEventListener(
        "click",
        async (event) => {
          try {
            if (confirmMessage) {
              const confirmed = confirm(confirmMessage);
              if (!confirmed) return;
            }

            const username = await handler(event);

            if (refreshTypes) {
              for (const type of refreshTypes) {
                this.refreshRequestList(type);
              }
            }

            toaster.success(`${toastMessage} ${username}`, toastIcon);
          } catch (error) {
            console.error(error);
            toaster.error(i18next.t("toast.friendRequestButtonError"));
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
          i18next.t("friendsView.confirmRemoveFriend"),
          ["friend"],
          this.handleDeleteButton,
          i18next.t("toast.terminatedFriendship"),
          "💀"
        );
        break;

      case "incoming":
        this.addButtonListeners(
          ".accept-btn",
          null,
          ["incoming", "friend"],
          this.handleAcceptButton,
          i18next.t("toast.acceptedFriendRequest"),
          "❤️"
        );
        this.addButtonListeners(
          ".decline-btn",
          i18next.t("friendsView.confirmDeclineRequest"),
          ["incoming"],
          this.handleDeleteButton,
          i18next.t("toast.declinedFriendRequest"),
          "💔"
        );
        break;

      case "outgoing":
        this.addButtonListeners(
          ".delete-request-btn",
          i18next.t("friendsView.confirmDeleteRequest"),
          ["outgoing"],
          this.handleDeleteButton,
          i18next.t("toast.deletedFriendRequest"),
          "💔"
        );
        break;
    }
  };

  private handleDeleteButton = async (event: Event): Promise<string> => {
    const btn = event.currentTarget as HTMLButtonElement;
    const requestId = this.getRequestIdFromButton(btn);
    const request = getDataOrThrow(await deleteFriendRequest(requestId));
    this.removeFriendRequest(request.id);
    const username = escapeHTML(request.friendUsername);
    return username;
  };

  private handleAcceptButton = async (event: Event): Promise<string> => {
    const btn = event.currentTarget as HTMLButtonElement;
    const requestid = this.getRequestIdFromButton(btn);
    const request = getDataOrThrow(await acceptFriendRequest(requestid));
    this.removeFriendRequest(request.id);
    this.addFriendRequest(request);
    const username = escapeHTML(request.friendUsername);
    return username;
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

    statusSpan.textContent = isOnline
      ? i18next.t("global.online")
      : i18next.t("global.offline");
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
      const user = getDataOrThrow(await getUserByUsername(username));

      if (user === null) {
        markInvalid(i18next.t("global.userNotFound"), inputEl, errorEl);
        return;
      }
      clearInvalid(inputEl, errorEl);

      const request = getDataOrThrow(await createFriendRequest(user.id));
      this.removeFriendRequest(request.id);
      this.addFriendRequest(request);
      inputEl.value = "";
      this.refreshRequestList("outgoing");
      if (request.status === "PENDING") {
        toaster.success(i18next.t("toast.sendSuccess", { username: username }));
      } else if (request.status === "ACCEPTED") {
        toaster.success(
          i18next.t("toast.friendAdded", { username: username }),
          "❤️"
        );
        this.refreshRequestList("incoming");
        this.refreshRequestList("friend");
      }
    } catch (error) {
      router.handleError("handleSendRequestButton()", error);
    }
  };

  unmount(): void {
    console.log("Cleaning up FriendsView");
    this.controller.abort();
  }

  private getRequestIdFromButton(btn: Element): number {
    const li = btn.closest("li");
    if (!li || !li.dataset.requestId)
      throw new Error(i18next.t("error.missingRequestID"));
    return Number(li.dataset.requestId);
  }

  private getFriendRequest(requestId: number): FriendRequest {
    const request = this.friendRequests.find((r) => r.id === requestId);
    if (!request)
      throw new Error(i18next.t("error.requestNotFound", { id: requestId }));
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
          const requests = getDataOrThrow(
            await getUserFriendRequestByUsername(username)
          );
          if (requests[0]) {
            this.addFriendRequest(requests[0]);
            this.refreshRequestList("incoming");
          }
          break;
        }
        case "ACCEPTED": {
          const request = getDataOrThrow(
            await getUserFriendRequestByUsername(username)
          );
          if (request[0]) {
            this.removeFriendRequest(requestId);
            this.addFriendRequest(request[0]);
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
