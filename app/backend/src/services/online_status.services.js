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

  for (const friend of friends) {
    const friendReply = getOnlineUser(friend.id);
    if (friendReply) {
      const payload = JSON.stringify({ userId, status });
      friendReply.raw.write(`event: friendStatusChange\n`);
      friendReply.raw.write(`data: ${payload}\n\n`);
    }
  }
}
