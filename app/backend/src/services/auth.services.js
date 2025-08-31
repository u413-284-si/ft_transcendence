import pkg from "argon2";
import prisma from "../prisma/prismaClient.js";
import env from "../config/env.js";
import * as otpAuth from "otpauth";
import QRCode from "qrcode";
import { randSequence } from "@ngneat/falso";

export function verifyTwoFACode(twoFA, code) {
  const delta = twoFA.validate({ token: code, window: 1 });
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
  if (hash === null) return false;
  return await pkg.verify(hash, value);
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

export async function getTwoFASecret(userId) {
  const authentication = await prisma.authentication.findUniqueOrThrow({
    where: {
      userId: userId
    },
    select: {
      twoFASecret: true
    }
  });
  return authentication.twoFASecret;
}

export async function getTwoFAStatus(userId) {
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
  const accessToken = await reply.accessTokenSign(accessTokenPayload);
  const refreshToken = await reply.refreshTokenSign(refreshTokenPayload);

  const newHashedRefreshToken = await createHash(refreshToken);

  await updateUserRefreshToken(payload.id, newHashedRefreshToken);

  return { accessToken, refreshToken };
}

export async function createTwoFAToken(reply, payload) {
  const twoFALoginTokenPayload = { ...payload, type: "twoFALogin" };
  const twoFALoginToken = await reply.twoFALoginTokenSign(
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

export function generateTwoFA(username, secret) {
  return new otpAuth.TOTP({
    issuer: "ft_transcendence",
    label: username,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret
  });
}

export async function generateTwoFAQRCode(twoFA) {
  const uri = twoFA.toString();
  return await QRCode.toDataURL(uri);
}

export function generateTwoFASecret() {
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

export async function updateTwoFASecret(userId, secret) {
  await prisma.authentication.update({
    where: {
      userId: userId
    },
    data: {
      twoFASecret: secret
    }
  });
}

export async function updateTwoFAStatus(userId, status) {
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

export async function hashBackupCodes(backupCodes) {
  const hashedBackupCodes = await Promise.all(
    backupCodes.map(async (backupCode) => await createHash(backupCode))
  );
  return hashedBackupCodes;
}

export async function packageBackupCodes(userId, backupCodes) {
  let packagedBackupCodes = [];
  for (const backupCode of backupCodes) {
    packagedBackupCodes.push({
      userId: userId,
      backupCode: backupCode
    });
  }
  return packagedBackupCodes;
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
  const hashedBackupCodes = await hashBackupCodes(newBackupCodes);
  const packagedBackupCodes = await packageBackupCodes(
    userId,
    hashedBackupCodes
  );
  await createBackupCodes(packagedBackupCodes);

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
