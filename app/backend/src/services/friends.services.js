import prisma from "../prisma/prismaClient.js";

export async function getUserFriends(userId) {
  const friends = await prisma.friends.findMany({
    where: { userId: userId },
    select: {
      friend: {
        select: { id: true, username: true }
      }
    }
  });
  return friends;
}

export async function isFriends(userId, friendId) {
  const friendCount = await prisma.friends.count({
    where: { userId: userId, friendId: friendId }
  });
  return friendCount > 0;
}

export async function createFriend(userId, friendId) {
  const friend = await prisma.friends.create({
    data: {
      userId: userId,
      friendId: friendId
    }
  });
  return friend;
}
