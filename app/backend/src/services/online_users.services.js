import { getUserFriends } from "./friends.services.js";

const onlineUsers = new Map(); // key: userId, value: reply object

export function addOnlineUser(userId, reply) {
  onlineUsers.set(userId, reply);
}

export function removeOnlineUser(userId) {
  onlineUsers.delete(userId);
}

export function getOnlineUser(userId) {
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
  const data = friends.map((f) => f.friend);

  for (const id of data) {
    const friendReply = getOnlineUser(id);
    if (friendReply) {
      friendReply.raw.write(`data: ${JSON.stringify({ userId, status })}\n\n`);
    }
  }
}
