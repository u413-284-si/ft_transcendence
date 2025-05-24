import {
  addOnlineUser,
  notifyFriends,
  removeOnlineUser
} from "../services/online_status.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function sseOnlineHandler(request, reply) {
  const action = "SSE Online";
  try {
    const userId = parseInt(request.user.id, 10);

    // Setup SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders();

    const isNowOnline = addOnlineUser(userId, reply);
    if (isNowOnline) {
      notifyFriends(userId, "online");
    }

    // Clean up when client disconnects
    request.raw.on("close", () => {
      const isNowOffline = removeOnlineUser(userId, reply);
      if (isNowOffline) {
        notifyFriends(userId, "offline");
      }
    });
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
