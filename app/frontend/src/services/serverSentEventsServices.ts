import { sseLogger } from "../logging/config.js";
import { toaster } from "../Toaster.js";
import {
  FriendRequestEvent,
  FriendStatusChangeEvent,
  ProfileChangeEvent
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
    sseLogger.debug("Connected to server");
    reconnectAttempts = 0;

    if (isFirstConnection) {
      isFirstConnection = false;
    } else {
      toaster.success(i18next.t("toast.connectionReestablished"));
    }
  };

  eventSource.addEventListener("heartbeatEvent", (event: MessageEvent) => {
    sseLogger.debug("heartbeatEvent:", event.data);
  });

  eventSource.addEventListener("profileChangeEvent", (event: MessageEvent) => {
    sseLogger.debug("profileChangeEvent:", event.data);
    try {
      const { update } = JSON.parse(event.data);
      const detail: ProfileChangeEvent["detail"] = {
        update
      };
      window.dispatchEvent(
        new CustomEvent("app:ProfileChangeEvent", { detail })
      );
    } catch (e) {
      sseLogger.error("Failed to parse message", e);
    }
  });

  eventSource.addEventListener(
    "FriendStatusChangeEvent",
    (event: MessageEvent) => {
      sseLogger.debug("FriendStatusChangeEvent:", event.data);
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
        sseLogger.error("Failed to parse SSE message", e);
      }
    }
  );

  eventSource.addEventListener("FriendRequestEvent", (event: MessageEvent) => {
    sseLogger.debug("FriendRequestEvent:", event.data);
    try {
      const { requestId, username, status } = JSON.parse(event.data);
      const detail: FriendRequestEvent["detail"] = {
        requestId,
        username,
        status
      };
      switch (status) {
        case "PENDING":
          toaster.info(
            i18next.t("toast.friendSentFriendRequest", { username })
          );
          break;
        case "ACCEPTED":
          toaster.info(
            i18next.t("toast.friendAcceptedFriendRequest", { username }),
            "❤️"
          );
          break;
        case "DECLINED":
          toaster.info(
            i18next.t("toast.friendDeclinedFriendRequest", { username }),
            "💔"
          );
          break;
        case "RESCINDED":
          toaster.info(
            i18next.t("toast.friendRescindedFriendRequest", { username }),
            "💔"
          );
          break;
        case "DELETED":
          toaster.info(
            i18next.t("toast.friendRemovedFriend", { username }),
            "💀"
          );
          break;
      }
      window.dispatchEvent(
        new CustomEvent("app:FriendRequestEvent", { detail })
      );
    } catch (e) {
      sseLogger.error("Failed to parse message", e);
    }
  });

  eventSource.onerror = (error) => {
    sseLogger.error("onerror triggered:", error);
    closeSSEConnection();
    const reconnectDelayInS = reconnectDelayInMS / 1000;

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      sseLogger.debug(
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
      sseLogger.error("Max reconnect attempts reached. Not trying again.");
      toaster.error(i18next.t("toast.connectionUnavailable"));
    }
  };
}

export function closeSSEConnection(resetFirstConnection = false) {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    sseLogger.debug("Disconnected from server");
  }
  if (reconnectTimeoutID) {
    clearTimeout(reconnectTimeoutID);
    reconnectTimeoutID = null;
  }
  if (resetFirstConnection) {
    isFirstConnection = true;
    sseLogger.debug("isFirstConnection has been reset");
  }
}
