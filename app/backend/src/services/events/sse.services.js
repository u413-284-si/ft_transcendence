import { getUserFriends } from "../friends.services.js";
import {
  deleteEmitterIfUnused,
  emitToUser,
  getOrCreateEmitter
} from "./emitter.services.js";
import { addOnlineUser, removeOnlineUser } from "./presence.services.js";

export async function registerSSEConnection(userId, reply) {
  const isFirstConnection = addOnlineUser(userId, reply);
  const emitter = getOrCreateEmitter(userId);

  const handler = (event, data) => {
    reply.raw.write(`event: ${event}\n`);
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on("message", handler);

  reply.raw.on("close", async () => {
    emitter.off("message", handler);
    const isOffline = removeOnlineUser(userId, reply);
    if (isOffline) {
      deleteEmitterIfUnused(userId);
      await notifyFriends(userId, "offline");
    }
  });

  if (isFirstConnection) {
    await notifyFriends(userId, "online");
  }
}

async function notifyFriends(userId, status) {
  const friends = await getUserFriends(userId);

  for (const friend of friends) {
    emitToUser(friend.id, "FriendStatusChangeEvent", {
      userId: userId,
      status: status
    });
  }
}

export function notifyFriendRequestEvent(receiverId, requestId, status) {
  emitToUser(receiverId, "FriendRequestEvent", {
    requestId: requestId,
    status: status
  });
}
