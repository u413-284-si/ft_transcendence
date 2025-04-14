import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET
} from "../config/jwt.js";
import jwt from "jsonwebtoken";
import pkg from "argon2";

export function authorizeUserAccess(token) {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
}

export function authorizeUserRefresh(token) {
  return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
}

export async function createHashedPassword(password) {
  return await pkg.hash(password, {
    type: pkg.argon2id,
    memoryCost: 47104,
    parallelism: 1
  });
}

export async function verifyPassword(databasePassword, loginPassword) {
  return await pkg.verify(databasePassword, loginPassword);
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
  const accessTokenExpirationInSeconds = 15 * 60;
  const accessTokenTimeToExpire = new Date(
    new Date().getTime() + accessTokenExpirationInSeconds * 1000
  );

  const refreshTokenExpirationInSeconds = 7 * 24 * 60 * 60;
  const refreshTokenTimeToExpire = new Date(
    new Date().getTime() + refreshTokenExpirationInSeconds * 1000
  );

  const accessToken = createAccessToken(user, accessTokenExpirationInSeconds);
  const refreshToken = createRefreshToken(
    user,
    refreshTokenExpirationInSeconds
  );

  return {
    accessToken: {
      token: accessToken,
      timeToExpire: accessTokenTimeToExpire
    },
    refreshToken: {
      token: refreshToken,
      timeToExpire: refreshTokenTimeToExpire
    }
  };
}
