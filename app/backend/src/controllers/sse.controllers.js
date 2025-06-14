import { registerSSEConnection } from "../services/events/sse.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function sseConnectionHandler(request, reply) {
  const action = "SSE Connection";
  try {
    const userId = parseInt(request.user.id, 10);

    // Setup SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders();

    await registerSSEConnection(userId, reply);
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `sseOnlineHandler: ${createResponseMessage(action, false)}`
    );
    if (!reply.raw.headersSent) {
      return handlePrismaError(reply, action, err);
    } else {
      reply.raw.end();
    }
  }
}
