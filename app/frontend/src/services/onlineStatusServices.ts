import { FriendStatusChangeEvent } from "../types/FriendStatusChangeEvent";

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

  eventSource.addEventListener("friendStatusChange", (event: MessageEvent) => {
    console.log("📨 SSE message:", event.data);
    try {
      const { userId, status } = JSON.parse(event.data);
      const detail: FriendStatusChangeEvent["detail"] = {
        userId,
        isOnline: status === "online"
      };
      window.dispatchEvent(new CustomEvent("friendStatusChange", { detail }));
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
