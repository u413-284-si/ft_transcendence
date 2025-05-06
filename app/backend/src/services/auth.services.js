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
