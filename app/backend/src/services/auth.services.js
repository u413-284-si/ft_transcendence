import env from "../config/env.js";
import pkg from "argon2";
import fastify from "../app.js";
import prisma from "../prisma/prismaClient.js";

export function verifyAccessToken(token) {
  return fastify.jwt.verify(token, env.jwtAccessTokenSecret);
}

export function verifyRefreshToken(token) {
  return fastify.jwt.verify(token, env.jwtRefreshTokenSecret);
}

export async function createHashedPassword(password) {
  return await pkg.hash(password, {
    type: pkg.argon2id,
    memoryCost: 47104,
    parallelism: 1
  });
}

export async function createHashedRefreshToken(refreshToken) {
  return await pkg.hash(refreshToken, {
    type: pkg.argon2id,
    memoryCost: 47104,
    parallelism: 1
  });
}

export async function verifyPassword(databasePassword, loginPassword) {
  return await pkg.verify(databasePassword, loginPassword);
}

export async function verifyStoredRefreshToken(
  databaseRefreshToken,
  requestRefreshToken
) {
  return await pkg.verify(databaseRefreshToken, requestRefreshToken);
}

export function createAccessToken(user) {
  const token = fastify.jwt.sign(user, env.jwtAccessTokenSecret, {
    expiresIn: env.accessTokenTimeToExpireInMs
  });

  return token;
}

export function createRefreshToken(user) {
  const token = fastify.jwt.sign(user, env.jwtRefreshTokenSecret, {
    expiresIn: env.refreshTokenTimeToExpireInMS
  });

  return token;
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
