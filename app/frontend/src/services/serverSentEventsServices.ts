import { toaster } from "../Toaster.js";
import {
  FriendRequestEvent,
  FriendStatusChangeEvent
} from "../types/ServerSentEvents.js";

let eventSource: EventSource | null = null;

export function openSSEConnection() {
  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource("/api/users/online/", {
    withCredentials: true
  });

  eventSource.onopen = () => {
    console.log("🟢 Connected to SSE");
  };

  eventSource.addEventListener(
    "FriendStatusChangeEvent",
    (event: MessageEvent) => {
      console.log("📨 SSE message:", event.data);
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
    console.error("🔴 SSE error:", error);
    // Reconnect logic could go here
  };
}

export function stopOnlineStatusTracking() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log("🛑 Disconnected from SSE");
  }
}
