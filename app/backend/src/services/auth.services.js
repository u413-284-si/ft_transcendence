import env from "../config/env.js";
import pkg from "argon2";
import fastify from "../app.js";

export function verifyAccessToken(token) {
  fastify.jwt.verify(token, env.jwtAccessTokenSecret);
}

export function verifyRefreshToken(token) {
  fastify.jwt.verify(token, env.jwtRefreshTokenSecret);
}

export function decodeToken(token) {
  return fastify.jwt.decode(token, { complete: true });
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

export function createAccessToken(user, timeToExpireJWT) {
  const timeToExpireCookie = new Date(
    new Date().getTime() + timeToExpireJWT * 1000
  );

  const token = fastify.jwt.sign(user, env.jwtAccessTokenSecret, {
    expiresIn: timeToExpireJWT
  });

  return {
    token: token,
    timeToExpire: timeToExpireCookie
  };
}

export function createRefreshToken(user, timeToExpireJWT) {
  const timeToExpireCookie = new Date(
    new Date().getTime() + timeToExpireJWT * 1000
  );

  const token = fastify.jwt.sign(user, env.jwtRefreshTokenSecret, {
    expiresIn: timeToExpireJWT
  });

  return {
    token: token,
    timeToExpire: timeToExpireCookie
  };
}
