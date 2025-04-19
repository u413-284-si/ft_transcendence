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
    },
    select: {
      id: true,
      username: true,
      email: true
    }
  });
  return user;
}

export async function getUserPassword(usernameOrEmail) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    },
    include: {
      authentication: {
        select: {
          password: true
        }
      }
    }
  });

  return user;
}
