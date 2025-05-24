import { getUserFriends } from "./friends.services.js";

const onlineUsers = new Map(); // key: userId, value: Set of reply objects

export function addOnlineUser(userId, reply) {
  let replySet = getOnlineUserReplies(userId);

  if (!replySet) {
    replySet = new Set();
    onlineUsers.set(userId, replySet);
  }

  const wasOffline = replySet.size === 0;

  replySet.add(reply);

  return wasOffline;
}

export function removeOnlineUser(userId, reply) {
  const replySet = getOnlineUserReplies(userId);
  if (!replySet) return;

  replySet.delete(reply);

  const isOffline = replySet.size === 0;

  if (isOffline) {
    onlineUsers.delete(userId);
  }

  return isOffline;
}

export function getOnlineUserReplies(userId) {
  return onlineUsers.get(userId);
}

export function getAllOnlineUsers() {
  return onlineUsers;
}

export function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

export async function notifyFriends(userId, status) {
  const friends = await getUserFriends(userId);

  for (const friend of friends) {
    const replySet = getOnlineUserReplies(friend.id);
    if (replySet) {
      for (const reply of replySet) {
        const payload = JSON.stringify({ userId, status });
        reply.raw.write(`event: friendStatusChange\n`);
        reply.raw.write(`data: ${payload}\n\n`);
      }
    }
  }
}

export function addOnlineStatusToArray(array) {
  return array.map((item) => ({
    ...item,
    isOnline: isUserOnline(item.id)
  }));
}
