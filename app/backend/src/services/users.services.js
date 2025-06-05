import prisma from "../prisma/prismaClient.js";
import fs from "fs";
import path from "path";
import env from "../config/env.js";
import { fileTypeFromBuffer } from "file-type";

const tokenSelect = {
  id: true,
  username: true
};

const userSelect = {
  id: true,
  username: true,
  email: true,
  avatar: true,
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

export async function getTokenData(identifier, identifierType) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      [identifierType]: identifier
    },
    select: tokenSelect
  });
  return user;
}

export async function getUserAvatar(id) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      avatar: true
    }
  });
  return user.avatar;
}

export async function createUserAvatar(id, buffer) {
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType) {
    console.error("No image file type detected");
    throw new Error();
  }
  const correctExt = `.${fileType.ext}`;
  const newFileName = `user-${id}${correctExt}`;
  const uploadDir = path.resolve(env.imagePath);

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, newFileName);
  await fs.promises.writeFile(filePath, buffer);
  return newFileName;
}

export async function deleteUserAvatar(currentAvatarUrl) {
  const uploadDir = path.resolve(env.imagePath);
  const previousPath = path.join(uploadDir, path.basename(currentAvatarUrl));
  if (fs.existsSync(previousPath)) {
    await fs.promises.unlink(previousPath);
  }
}
