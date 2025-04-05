import prisma from "../prisma/prismaClient.js";

export async function createUser(username, email) {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      dateJoined: new Date(),
      authentication: { create: {} },
      stats: { create: {} },
      accountStatus: { create: {} }
    },
    select: {
      id: true,
      username: true,
      email: true
    }
  });
  return user;
}

export async function getUser(id) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  return user;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function updateUser(id, updateData) {
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true
    }
  });
  return updatedUser;
}

export async function deleteUser(id) {
  const user = await prisma.user.delete({
    where: {
      id
    }
  });
  return user;
}

export async function getUserMatches(id) {
  const matches = await prisma.match.findMany({
    where: {
      playerId: id
    },
    select: {
      playerNickname: true,
      opponentNickname: true,
      playerScore: true,
      opponentScore: true,
      date: true
    }
  });
  return matches;
}
