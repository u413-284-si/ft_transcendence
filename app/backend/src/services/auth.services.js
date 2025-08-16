import pkg from "argon2";
import prisma from "../prisma/prismaClient.js";
import env from "../config/env.js";

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
  if (hash === null) return false;
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

export async function deleteUserRefreshToken(userId) {
  await prisma.authentication.update({
    where: { userId: userId },
    data: { refreshToken: null }
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

export function setCookies(reply, accessToken, refreshToken) {
  const accessTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.accessTokenTimeToExpireInMs)
  );
  const refreshTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.refreshTokenTimeToExpireInMS)
  );
  return reply
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: accessTokenTimeToExpire
    })
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
      expires: refreshTokenTimeToExpire
    });
}

export async function updatePassword(userId, hashedNewPassword) {
  await prisma.authentication.update({
    where: {
      userId: userId
    },
    data: {
      password: hashedNewPassword
    }
  });
}
