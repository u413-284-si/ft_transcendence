import pkg from "argon2";
import prisma from "../prisma/prismaClient.js";

export async function verifyAccessToken(request) {
  return await request.accessTokenVerify();
}

export async function verifyRefreshToken(request) {
  return await request.refreshTokenVerify();
}

export async function createHash(value) {
  return await pkg.hash(value, {
    type: pkg.argon2id,
    memoryCost: 47104,
    parallelism: 1
  });
}

export async function verifyHash(hash, value) {
  return await pkg.verify(hash, value);
}

export async function createAccessToken(reply, user) {
  return await reply.accessTokenSign(user);
}

export async function createRefreshToken(reply, user) {
  return await reply.refreshTokenSign(user);
}

export async function updateUserRefreshToken(userId, hashedRefreshToken) {
  await prisma.authentication.update({
    where: {
      userId: userId
    },
    data: {
      refreshToken: hashedRefreshToken
    }
  });
}

export async function getPasswordHash(userId) {
  const authentication = await prisma.authentication.findUniqueOrThrow({
    where: {
      userId: userId
    },
    select: {
      password: true
    }
  });
  return authentication.password;
}

export async function getTokenHash(userId) {
  const authentication = await prisma.authentication.findUniqueOrThrow({
    where: {
      userId: userId
    },
    select: {
      refreshToken: true
    }
  });
  return authentication.refreshToken;
}

export async function createAuthTokens(reply, payload) {
  const accessToken = await createAccessToken(reply, payload);
  const refreshToken = await createRefreshToken(reply, { id: payload.id });

  const newHashedRefreshToken = await createHash(refreshToken);

  await updateUserRefreshToken(payload.id, newHashedRefreshToken);

  return { accessToken, refreshToken };
}
