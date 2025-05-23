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
