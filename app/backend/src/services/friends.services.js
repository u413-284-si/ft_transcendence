import prisma from "../prisma/prismaClient.js";

const friendSelect = {
  friend: {
    select: { id: true, username: true }
  }
};
export async function getUserFriends(userId) {
  const friends = await prisma.friends.findMany({
    where: { userId: userId },
    select: friendSelect
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

export async function deleteFriend(userId, friendId) {
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
