import pkg from "argon2";
import prisma from "../prisma/prismaClient.js";
import env from "../config/env.js";
import * as otpAuth from "otpauth";
import QRCode from "qrcode";
import { randSequence } from "@ngneat/falso";

export async function verifyAccessToken(request) {
  return await request.accessTokenVerify();
}

export async function verifyRefreshToken(request) {
  return await request.refreshTokenVerify();
}

export async function verifyTwoFaLoginToken(request) {
  return await request.twoFaLoginTokenVerify();
}

export function verify2FaToken(totp, token) {
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
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

export async function creatTwoFaLoginToken(reply, user) {
  return await reply.twoFaLoginTokenSign(user);
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

export async function getTotpSecret(userId) {
  const authentication = await prisma.authentication.findUniqueOrThrow({
    where: {
      userId: userId
    },
    select: {
      totpSecret: true
    }
  });
  return authentication.totpSecret;
}

export async function get2FaStatus(userId) {
  const authentication = await prisma.authentication.findUniqueOrThrow({
    where: {
      userId: userId
    },
    select: {
      has2FA: true
    }
  });
  return authentication.has2FA;
}

export async function createAuthTokens(reply, payload) {
  const accessTokenPayload = { ...payload, tokenTyp: "access" };
  const refreshTokenPayload = { id: payload.id, tokenTyp: "refresh" };
  const accessToken = await createAccessToken(reply, accessTokenPayload);
  const refreshToken = await createRefreshToken(reply, refreshTokenPayload);

  const newHashedRefreshToken = await createHash(refreshToken);

  await updateUserRefreshToken(payload.id, newHashedRefreshToken);

  return { accessToken, refreshToken };
}

export async function createTwoFaToken(reply, payload) {
  const twoFaLoginTokenPayload = { ...payload, tokenTyp: "twoFaLogin" };
  const twoFaLoginToken = await creatTwoFaLoginToken(
    reply,
    twoFaLoginTokenPayload
  );
  return twoFaLoginToken;
}

export function setAuthCookies(reply, accessToken, refreshToken) {
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

export function setTwoFaCookie(reply, twoFaLoginToken) {
  const twoFaLoginTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.twoFaLoginTokenTimeToExpireInMS)
  );

  return reply.setCookie("twoFaLoginToken", twoFaLoginToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/2fa/login/",
    expires: twoFaLoginTokenTimeToExpire
  });
}

export function generateTotp(username, secret) {
  return new otpAuth.TOTP({
    issuer: "ft_transcendence",
    label: username,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret
  });
}

export async function generate2FaQrCode(totp) {
  const uri = totp.toString();
  return await QRCode.toDataURL(uri);
}

export function generate2FaSecret() {
  return new otpAuth.Secret({
    size: 20
  }).base32;
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

export async function updateTotpSecret(userId, secret) {
  await prisma.authentication.update({
    where: {
      userId: userId
    },
    data: {
      totpSecret: secret
    }
  });
}

export async function update2FaStatus(userId, status) {
  await prisma.authentication.update({
    where: {
      userId: userId
    },
    data: {
      has2FA: status
    }
  });
}

export function generateBackupCode() {
  return randSequence({ size: 8, charType: "numeric" });
}

export function generateBackupCodes() {
  let backupCodes = [];
  for (let i = 0; i < 10; i++) {
    backupCodes.push(generateBackupCode());
  }
  return backupCodes;
}

export async function hashBackupCodes(userId, backupCodes) {
  let hashedBackupCodes = [];
  for (const backupCode of backupCodes) {
    hashedBackupCodes.push({
      userId: userId,
      backupCode: await createHash(backupCode)
    });
  }
  return hashedBackupCodes;
}

export async function createBackupCodes(backupCodes) {
  await prisma.backupCode.createMany({
    data: backupCodes
  });
}

export async function deleteBackupCodes(backupCodes, userId) {
  await prisma.backupCode.deleteMany({
    where: {
      userId: userId
    }
  });
}

export async function getBackupCodes(userId) {
  return await prisma.backupCode.findMany({
    where: {
      userId: userId
    }
  });
}
