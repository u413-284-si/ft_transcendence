import prisma from "../prisma/prismaClient.js";
import { isUserOnline } from "./events/presence.services.js";

const friendRequestInclude = {
  sender: { select: { id: true, username: true, avatar: true } },
  receiver: { select: { id: true, username: true, avatar: true } }
};

export async function getUserFriends(userId) {
  const acceptedRequests = await prisma.friendRequest.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      sender: { select: { username: true } },
      receiver: { select: { username: true } }
    }
  });
  const friends = acceptedRequests.map((req) => {
    const isSender = req.senderId === userId;
    const friendId = isSender ? req.receiverId : req.senderId;
    const friendUsername = isSender
      ? req.receiver.username
      : req.sender.username;
    return {
      requestId: req.id,
      friendId: friendId,
      friendUsername: friendUsername
    };
  });

  return friends;
}

function formatFriendRequest(request, userId) {
  const isSender = request.senderId === userId;
  const friend = isSender ? request.receiver : request.sender;
  const isOnline =
    request.status === "ACCEPTED" ? isUserOnline(friend.id) : false;

  return {
    id: request.id,
    status: request.status,
    sender: isSender,
    friendId: friend.id,
    friendUsername: friend.username,
    friendAvatar: friend.avatar,
    isOnline: isOnline
  };
}

export async function getAllUserFriendRequests(userId, friendUsername) {
  const OR = [];

  if (friendUsername) {
    OR.push(
      { senderId: userId, receiver: { username: friendUsername } },
      { sender: { username: friendUsername }, receiverId: userId }
    );
  } else {
    OR.push({ senderId: userId }, { receiverId: userId });
  }
  const requests = await prisma.friendRequest.findMany({
    where: { OR },
    include: friendRequestInclude
  });

  const formatted = requests.map((req) => formatFriendRequest(req, userId));

  return formatted;
}

export async function getUserFriendRequest(userId, friendId) {
  const request = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId }
      ]
    },
    include: friendRequestInclude
  });
  if (!request) return;
  const formatted = formatFriendRequest(request, userId);
  return formatted;
}

export async function createFriendRequest(userId, friendId) {
  const request = await prisma.friendRequest.create({
    data: {
      senderId: userId,
      receiverId: friendId,
      status: "PENDING"
    },
    include: friendRequestInclude
  });
  const formatted = formatFriendRequest(request, userId);
  return formatted;
}

export async function updateFriendRequest(id, userId, status) {
  const request = await prisma.friendRequest.update({
    where: { id, OR: [{ senderId: userId }, { receiverId: userId }] },
    data: { status },
    include: friendRequestInclude
  });
  const formatted = formatFriendRequest(request, userId);
  return formatted;
}

export async function deleteFriendRequest(id, userId) {
  const request = await prisma.friendRequest.delete({
    where: { id, OR: [{ senderId: userId }, { receiverId: userId }] },
    include: friendRequestInclude
  });
  const formatted = formatFriendRequest(request, userId);
  return formatted;
}

export async function getFriendRequest(id, userId) {
  const request = await prisma.friendRequest.findUniqueOrThrow({
    where: { id, OR: [{ senderId: userId }, { receiverId: userId }] },
    include: friendRequestInclude
  });
  const formatted = formatFriendRequest(request, userId);
  return formatted;
}
