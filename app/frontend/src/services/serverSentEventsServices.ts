import { toaster } from "../Toaster.js";
import {
  FriendRequestEvent,
  FriendStatusChangeEvent
} from "../types/ServerSentEvents.js";

let eventSource: EventSource | null = null;
let reconnectTimeoutID: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;
const reconnectDelayInMS = 5000;
let isFirstConnection = true;

export function openSSEConnection() {
  closeSSEConnection();

  eventSource = new EventSource("/api/users/me/online", {
    withCredentials: true
  });

  eventSource.onopen = () => {
    console.log("Connected to online status SSE");
    reconnectAttempts = 0;

    if (isFirstConnection) {
      isFirstConnection = false;
    } else {
      toaster.success(i18next.t("toast.connectionReestablished"));
    }
  };

  eventSource.addEventListener("heartbeatEvent", (event: MessageEvent) => {
    console.log("SSE message:", event.data);
  });

  eventSource.addEventListener(
    "FriendStatusChangeEvent",
    (event: MessageEvent) => {
      console.log("SSE message:", event.data);
      try {
        const { requestId, username, status } = JSON.parse(event.data);
        const detail: FriendStatusChangeEvent["detail"] = {
          requestId,
          username,
          isOnline: status === "online"
        };
        toaster.info(i18next.t("toast.userStatus", { username, status }));
        window.dispatchEvent(
          new CustomEvent("app:FriendStatusChangeEvent", { detail })
        );
      } catch (e) {
        console.error("Failed to parse SSE message", e);
      }
    }
  );

  eventSource.addEventListener("FriendRequestEvent", (event: MessageEvent) => {
    console.log("📨 SSE message:", event.data);
    try {
      const { requestId, username, status } = JSON.parse(event.data);
      const detail: FriendRequestEvent["detail"] = {
        requestId,
        username,
        status
      };
      switch (status) {
        case "PENDING":
          toaster.info(i18next.t("toast.userSentFriendRequest", { username }));
          break;
        case "ACCEPTED":
          toaster.info(
            i18next.t("toast.userAcceptedFriendRequest", { username }),
            "❤️"
          );
          break;
        case "DECLINED":
          toaster.info(
            i18next.t("toast.userDeclinedFriendRequest", { username }),
            "💔"
          );
          break;
        case "RESCINDED":
          toaster.info(
            i18next.t("toast.userRescindedFriendRequest", { username }),
            "💔"
          );
          break;
        case "DELETED":
          toaster.info(
            i18next.t("toast.userRemovedFriend", { username }),
            "💀"
          );
          break;
      }
      window.dispatchEvent(
        new CustomEvent("app:FriendRequestEvent", { detail })
      );
    } catch (e) {
      console.error("Failed to parse SSE message", e);
    }
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
    closeSSEConnection();
    const reconnectDelayInS = reconnectDelayInMS / 1000;

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      console.log(
        `Reconnecting in ${reconnectDelayInS} seconds... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
      );
      toaster.warn(
        i18next.t("toast.connectionLost", {
          delay: reconnectDelayInS,
          attempt: reconnectAttempts,
          maxAttempts: maxReconnectAttempts
        })
      );
      reconnectTimeoutID = setTimeout(() => {
        reconnectTimeoutID = null;
        openSSEConnection();
      }, reconnectDelayInMS);
    } else {
      console.error("Max reconnect attempts reached. Not trying again.");
      toaster.error(i18next.t("toast.connectionUnavailable"));
    }
  };
}

export function closeSSEConnection(resetFirstConnection = false) {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log("Disconnected from online status SSE");
  }
  if (reconnectTimeoutID) {
    clearTimeout(reconnectTimeoutID);
    reconnectTimeoutID = null;
  }
  if (resetFirstConnection) {
    isFirstConnection = true;
    console.log("isFirstConnection has been reset");
  }
}
