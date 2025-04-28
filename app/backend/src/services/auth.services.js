import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET
} from "../config/jwt.js";
import jwt from "jsonwebtoken";
import pkg from "argon2";

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
}

export function decodeAccessToken(token) {
  return jwt.decode(token, { complete: true });
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

export function createAccessToken(user, timeToExpire) {
  return jwt.sign(user, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: timeToExpire
  });
}

export function createRefreshToken(user, timeToExpire) {
  return jwt.sign(user, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: timeToExpire
  });
}

export function createAccessAndRefreshToken(user) {
  const accessTokenTimeToExpireJWT = 5;
  const accessTokenTimeToExpireCookie = new Date(
    new Date().getTime() + accessTokenTimeToExpireJWT * 1000
  );

  const refreshTokenTimeToExpireJWT = 30;
  const refreshTokenTimeToExpireCookie = new Date(
    new Date().getTime() + refreshTokenTimeToExpireJWT * 1000
  );

  const accessToken = createAccessToken(user, accessTokenTimeToExpireJWT);
  const refreshToken = createRefreshToken(user, refreshTokenTimeToExpireJWT);

  return {
    accessToken: {
      token: accessToken,
      timeToExpire: accessTokenTimeToExpireCookie
    },
    refreshToken: {
      token: refreshToken,
      timeToExpire: refreshTokenTimeToExpireCookie
    }
  };
}
