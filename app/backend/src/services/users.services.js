import prisma from "../prisma/prismaClient.js";

export async function createUser(username, email, hashedPassword) {
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      dateJoined: new Date(),
      authentication: {
        create: {
          password: hashedPassword
        }
      },
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

export async function getUserID(usernameOrEmail) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    },
    select: {
      id: true
    }
  });

  return user.id;
}

export async function getUserData(userId) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId
    },
    select: {
      id: true,
      username: true,
      authentication: {
        select: {
          password: true,
          refreshToken: true
        }
      }
    }
  });

  return user;
}

export async function updateUserRefreshToken(userId, hashedRefreshToken) {
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      authentication: {
        update: {
          refreshToken: hashedRefreshToken
        }
      }
    }
  });
}
