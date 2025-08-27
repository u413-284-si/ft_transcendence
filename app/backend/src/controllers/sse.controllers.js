import { registerSSEConnection } from "../services/events/sse.services.js";

export async function sseConnectionHandler(request, reply) {
  request.action = "SSE Connection";

  const userId = request.user.id;
  const username = request.user.username;

  // Setup SSE headers
  reply.raw.setHeader("Content-Type", "text/event-stream");
  reply.raw.setHeader("Cache-Control", "no-cache");
  reply.raw.setHeader("Connection", "keep-alive");
  reply.raw.flushHeaders();

  await registerSSEConnection(userId, username, reply);
}
