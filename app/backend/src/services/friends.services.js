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

export async function isFriends(userId, friendId) {
  const existing = await prisma.friends.findUnique({
    where: { userId_friendId: { userId: userId, friendId: friendId } }
  });
  return existing ? true : false;
}

export async function createFriendship(userId, friendId) {
  const count = await prisma.friends.createMany({
    data: [
      { userId: userId, friendId: friendId },
      { userId: friendId, friendId: userId }
    ]
  });
  return count;
}

export async function deleteFriendship(userId, friendId) {
  const count = await prisma.friends.deleteMany({
    where: {
      OR: [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId }
      ]
    }
  });
  return count;
}
