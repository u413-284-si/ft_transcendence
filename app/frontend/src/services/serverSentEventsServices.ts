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
      toaster.success("Connection reestablished");
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
        toaster.info(`${username} is ${status}`);
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
          toaster.info(`${username} sent you a friend request`);
          break;
        case "ACCEPTED":
          toaster.info(`${username} accepted your friend request`);
          break;
        case "DELETED":
          toaster.info(`${username} terminated friendship`);
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

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      console.log(
        `Reconnecting in ${reconnectDelayInMS / 1000} seconds... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
      );
      toaster.warn(
        `Lost connection — retrying in ${reconnectDelayInMS / 1000} seconds... (Attempt ${reconnectAttempts} of ${maxReconnectAttempts})`
      );
      reconnectTimeoutID = setTimeout(() => {
        reconnectTimeoutID = null;
        openSSEConnection();
      }, reconnectDelayInMS);
    } else {
      console.error("Max reconnect attempts reached. Not trying again.");
      toaster.error("Unable to reconnect. Stop until refresh.");
    }
  };
}

export function closeSSEConnection() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log("Disconnected from online status SSE");
  }
  if (reconnectTimeoutID) {
    clearTimeout(reconnectTimeoutID);
    reconnectTimeoutID = null;
  }
}
