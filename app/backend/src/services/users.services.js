import prisma from "../prisma/prismaClient.js";

export const accessTokenSelect = {
  id: true,
  username: true
};

export const refreshTokenSelect = {
  id: true
};

const userSelect = {
  id: true,
  username: true,
  email: true,
  dateJoined: true
};

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
    select: userSelect
  });
  return user;
}

export async function getUser(id) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id
    },
    select: userSelect
  });
  return user;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({ select: userSelect });
  return users;
}

export async function updateUser(id, updateData) {
  const updatedUser = await prisma.user.update({
    where: {
      id
    },
    data: updateData,
    select: userSelect
  });
  return updatedUser;
}

export async function deleteUser(id) {
  const user = await prisma.user.delete({
    where: {
      id
    },
    select: userSelect
  });
  return user;
}

export async function getTokenData(identifier, identifierType, selectType) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      [identifierType]: identifier
    },
    select: selectType
  });

  return user;
}
