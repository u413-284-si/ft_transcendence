import pkg from "argon2";
import prisma from "../prisma/prismaClient.js";
import env from "../config/env.js";
import * as otpAuth from "otpauth";
import QRCode from "qrcode";

export async function verifyAccessToken(request) {
  return await request.accessTokenVerify();
}

export async function verifyRefreshToken(request) {
  return await request.refreshTokenVerify();
}

export function verify2FaCode(totp, code) {
  return totp.validate({ code, window: 1 });
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
