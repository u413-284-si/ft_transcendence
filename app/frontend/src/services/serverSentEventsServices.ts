import {
  FriendRequestEvent,
  FriendStatusChangeEvent
} from "../types/ServerSentEvents";

let eventSource: EventSource | null = null;

export function startOnlineStatusTracking() {
  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource("/api/users/online/", {
    withCredentials: true
  });

  eventSource.onopen = () => {
    console.log("🟢 Connected to online status SSE");
  };

  eventSource.addEventListener(
    "FriendStatusChangeEvent",
    (event: MessageEvent) => {
      console.log("📨 SSE message:", event.data);
      try {
        const { requestId, status } = JSON.parse(event.data);
        const detail: FriendStatusChangeEvent["detail"] = {
          requestId,
          isOnline: status === "online"
        };
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
      const { requestId, status } = JSON.parse(event.data);
      const detail: FriendRequestEvent["detail"] = {
        requestId,
        status
      };
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
    console.log("🛑 Disconnected from online status SSE");
  }
}
