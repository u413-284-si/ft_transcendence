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

export async function verifyTwoFALoginToken(request) {
  return await request.twoFALoginTokenVerify();
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

export async function creatTwoFALoginToken(reply, user) {
  return await reply.twoFALoginTokenSign(user);
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
      hasTwoFA: true
    }
  });
  return authentication.hasTwoFA;
}

export async function createAuthTokens(reply, payload) {
  const accessTokenPayload = { ...payload, type: "access" };
  const refreshTokenPayload = { id: payload.id, type: "refresh" };
  const accessToken = await createAccessToken(reply, accessTokenPayload);
  const refreshToken = await createRefreshToken(reply, refreshTokenPayload);

  const newHashedRefreshToken = await createHash(refreshToken);

  await updateUserRefreshToken(payload.id, newHashedRefreshToken);

  return { accessToken, refreshToken };
}

export async function createTwoFAToken(reply, payload) {
  const twoFALoginTokenPayload = { ...payload, type: "twoFALogin" };
  const twoFALoginToken = await creatTwoFALoginToken(
    reply,
    twoFALoginTokenPayload
  );
  return twoFALoginToken;
}

export function setAuthCookies(accessToken, refreshToken) {
  const accessTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.accessTokenTimeToExpireInMs)
  );
  const refreshTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.refreshTokenTimeToExpireInMS)
  );
  return this.setCookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: accessTokenTimeToExpire
  }).setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
    expires: refreshTokenTimeToExpire
  });
}

export function setTwoFACookie(twoFALoginToken) {
  const twoFALoginTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.twoFALoginTokenTimeToExpireInMS)
  );

  return this.setCookie("twoFALoginToken", twoFALoginToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/2fa/login/",
    expires: twoFALoginTokenTimeToExpire
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

export async function generate2FaQRCode(totp) {
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
      hasTwoFA: status
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

export async function verifyBackupCode(userId, backupCode) {
  const hashedBackupCodes = await getBackupCodes(userId);
  for (const hashedBackupCode of hashedBackupCodes) {
    if (await verifyHash(hashedBackupCode.backupCode, backupCode)) {
      await deleteBackupCode(hashedBackupCode.id);
      return true;
    }
  }
  return false;
}

export async function updateBackupCodes(userId) {
  const existingBackupCodes = await getBackupCodes(userId);
  if (existingBackupCodes.length > 0) await deleteBackupCodes(userId);

  const newBackupCodes = generateBackupCodes();
  const hashedBackupCodes = await hashBackupCodes(userId, newBackupCodes);
  await createBackupCodes(hashedBackupCodes);

  return newBackupCodes;
}

export async function createBackupCodes(backupCodes) {
  await prisma.backupCode.createMany({
    data: backupCodes
  });
}

export async function deleteBackupCodes(userId) {
  await prisma.backupCode.deleteMany({
    where: {
      userId: userId
    }
  });
}

export async function deleteBackupCode(backupCodeId) {
  await prisma.backupCode.delete({
    where: {
      id: backupCodeId
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
