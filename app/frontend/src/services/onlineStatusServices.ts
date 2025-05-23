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

  eventSource.onmessage = (event) => {
    console.log("📨 SSE message:", event.data);
    try {
      const { userId, status } = JSON.parse(event.data);
      // Dispatch a custom event with the data
      window.dispatchEvent(
        new CustomEvent("friendStatusChanged", {
          detail: { userId, isOnline: status === "online" }
        })
      );
    } catch (e) {
      console.error("Failed to parse SSE message", e);
    }
  };

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
