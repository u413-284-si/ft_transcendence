import { toaster } from "../Toaster.js";
import { FriendStatusChangeEvent } from "../types/FriendStatusChangeEvent.js";

let eventSource: EventSource | null = null;
let reconnectTimeoutID: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;
const reconnectDelayInMS = 5000;
let isFirstConnection = true;

export function startOnlineStatusTracking() {
  stopOnlineStatusTracking();

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

  eventSource.addEventListener("friendStatusChange", (event: MessageEvent) => {
    console.log("SSE message:", event.data);
    try {
      const { userId, status } = JSON.parse(event.data);
      const detail: FriendStatusChangeEvent["detail"] = {
        userId,
        isOnline: status === "online"
      };
      toaster.info("A friend came online");
      window.dispatchEvent(new CustomEvent("friendStatusChange", { detail }));
    } catch (e) {
      console.error("Failed to parse SSE message", e);
    }
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);

    stopOnlineStatusTracking();

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
        startOnlineStatusTracking();
      }, reconnectDelayInMS);
    } else {
      console.error("Max reconnect attempts reached. Not trying again.");
      toaster.error("Unable to reconnect. Stop until refresh.");
    }
  };
}

export function stopOnlineStatusTracking() {
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
