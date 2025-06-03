import prisma from "../prisma/prismaClient.js";

export async function getUserFriends(userId) {
  const acceptedRequests = await prisma.friendRequest.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    select: {
      senderId: true,
      receiverId: true,
      sender: {
        select: { id: true, username: true }
      },
      receiver: {
        select: { id: true, username: true }
      }
    }
  });
  const friends = acceptedRequests.map((req) => {
    const isSender = req.senderId === userId;
    const friend = isSender ? req.receiver : req.sender;
    return {
      id: friend.id,
      username: friend.username
    };
  });

  return friends;
}

export async function getAllUserFriendRequests(userId) {
  const requests = await prisma.friendRequest.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }]
    }
  });

  return requests;
}

export async function isFriends(senderId, receiverId) {
  const existing = await prisma.friendRequest.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }
  });
  return existing ? true : false;
}

export async function getPendingRequest(senderId, receiverId) {
  const pending = await prisma.friendRequest.findFirst({
    where: {
      status: "PENDING",
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }
  });
  return pending;
}

export async function createFriendRequest(senderId, receiverId) {
  const request = await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
      status: "PENDING"
    }
  });
  return request;
}

export async function updateFriendRequest(id, status) {
  const request = await prisma.friendRequest.update({
    where: { id },
    data: { status }
  });
  return request;
}

export async function deleteFriendRequest(id) {
  const request = await prisma.friendRequest.delete({
    where: { id }
  });
  return request;
}

export async function getUserFriendRequest(id, userId) {
  const request = await prisma.friendRequest.findUniqueOrThrow({
    where: { id, OR: [{ senderId: userId }, { receiverId: userId }] }
  });
  return request;
}
