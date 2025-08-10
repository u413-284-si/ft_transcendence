import {
  getPasswordHash,
  verifyRefreshToken,
  verifyHash,
  createAuthTokens,
  getTokenHash,
  deleteUserRefreshToken,
  setAuthCookies,
  updateTotpSecret,
  generateTotp,
  generate2FaQrCode,
  generate2FaSecret,
  verify2FaToken,
  getTotpSecret,
  update2FaStatus,
  get2FaStatus,
  createTwoFAToken,
  setTwoFACookie,
  generateBackupCodes,
  hashBackupCodes,
  getBackupCodes,
  createBackupCodes,
  deleteBackupCodes,
  verifyBackupCode
} from "../services/auth.services.js";
import {
  getTokenData,
  getUserByEmail,
  getUserByUsername,
  createRandomUsername,
  isUserNameValid,
  getUser
} from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { createUser, getUserAuthProvider } from "../services/users.services.js";
import fastify from "../app.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const identifier = usernameOrEmail.includes("@") ? "email" : "username";
    const payload = await getTokenData(usernameOrEmail, identifier);

    const authProvider = await getUserAuthProvider(payload.id);
    if (authProvider !== "LOCAL") {
      return httpError(
        reply,
        409,
        createResponseMessage(action, false),
        "User already registered with " + authProvider
      );
    }

    const hashedPassword = await getPasswordHash(payload.id);

    if (!(await verifyHash(hashedPassword, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    if ((await get2FaStatus(payload.id)) === true) {
      const twoFALoginToken = await createTwoFAToken(reply, payload);
      return setTwoFACookie(reply, twoFALoginToken)
        .code(200)
        .send({
          message: createResponseMessage(action, true),
          data: { username: payload.username }
        });
    }

    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: { username: payload.username }
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `loginUserHandler: ${createResponseMessage(action, false)}`
    );
    if (err.code === "P2025") {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }
    handlePrismaError(reply, action, err);
  }
}

export async function googleOauth2LoginHandler(request, reply) {
  const action = "OAuth2 login user";
  try {
    const { token } =
      await fastify.googleOauth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );
    if (!token) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "No token provided"
      );
    }

    reply
      .clearCookie("oauth2-code-verifier")
      .clearCookie("oauth2-redirect-state");

    const googleUser = await fastify.googleOauth2.userinfo(token.access_token);
    const dbUser = await getUserByEmail(googleUser.email);
    if (!dbUser) {
      let username = createRandomUsername();
      while (
        (await getUserByUsername(username)) ||
        !isUserNameValid(request, username)
      ) {
        username = createRandomUsername();
      }
      await createUser(username, googleUser.email, "", "GOOGLE");
    } else if ((await getUserAuthProvider(dbUser.id)) !== "GOOGLE") {
      return reply
        .setCookie("authProviderConflict", "GOOGLE", {
          secure: true,
          path: "/login",
          maxAge: 10
        })
        .redirect("http://localhost:4000/login");
    }

    const payload = await getTokenData(googleUser.email, "email");

    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );

    reply = setAuthCookies(reply, accessToken, refreshToken);

    return reply.redirect("http://localhost:4000/home");
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `oAuth2LoginUserHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function authAndDecodeAccessHandler(request, reply) {
  const action = "Auth and decode access token";
  try {
    const data = request.user;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authAndDecodeAccessHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function authAndDecodTwoFALoginHandler(request, reply) {
  const action = "Auth and decode 2FA login token";
  try {
    const data = request.user;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authAndDecodeAccessHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function authRefreshHandler(request, reply) {
  const action = "Auth refresh token";
  try {
    const token = request.cookies.refreshToken;
    if (!token) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "No refresh token provided"
      );
    }

    const userDataRefreshToken = await verifyRefreshToken(request);
    const userId = userDataRefreshToken.id;

    const hashedRefreshToken = await getTokenHash(userId);
    const payload = await getTokenData(userId, "id");

    if (!(await verifyHash(hashedRefreshToken, token))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid refresh token"
      );
    }

    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({ message: createResponseMessage(action, true) });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFAQRCodeHandler(request, reply) {
  const action = "Generate 2FA QR Code";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA Qrcode can not be generated. User uses Google auth provider"
      );
    }

    const { password } = request.body;
    const hashedPassword = await getPasswordHash(userId);

    if (!(await verifyHash(hashedPassword, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    const username = request.user.username;
    let secret = "";
    if (await get2FaStatus(userId)) {
      secret = await getTotpSecret(request.user.id);
    } else {
      secret = generate2FaSecret();
    }

    const totp = generateTotp(username, secret);
    const qrcode = await generate2FaQrCode(totp);
    const data = { qrcode: qrcode };

    await updateTotpSecret(userId, secret);

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFAVerifyHandler(request, reply) {
  const action = "Verify 2FA Code";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA code can not be verified. User uses Google auth provider"
      );
    }

    const { code } = request.body;
    const secret = await getTotpSecret(userId);
    const totp = generateTotp(request.user.username, secret);
    if (!verify2FaToken(totp, code)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid 2FA code"
      );
    }

    await update2FaStatus(userId, true);

    const existingBackupCodes = await getBackupCodes(userId);
    if (existingBackupCodes.length > 0) await deleteBackupCodes(userId);

    const newBackupCodes = generateBackupCodes();
    const hashedBackupCodes = await hashBackupCodes(userId, newBackupCodes);
    await createBackupCodes(hashedBackupCodes);
    const data = { backupCodes: newBackupCodes };

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFABackupCodesHandler(request, reply) {
  const action = "Generate backup codes";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA code can not be verified. User uses Google auth provider"
      );
    }

    const { password } = request.body;
    const hashedPassword = await getPasswordHash(userId);

    if (!(await verifyHash(hashedPassword, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    const existingBackupCodes = await getBackupCodes(userId);
    if (existingBackupCodes.length > 0) await deleteBackupCodes(userId);

    const newBackupCodes = generateBackupCodes();
    const hashedBackupCodes = await hashBackupCodes(userId, newBackupCodes);
    await createBackupCodes(hashedBackupCodes);
    const data = { backupCodes: newBackupCodes };

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (error) {
    request.log.error(
      { error, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, error);
  }
}

export async function twoFABackupCodeVerifyHandler(request, reply) {
  const action = "Verify backup codes";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA code can not be verified. User uses Google auth provider"
      );
    }

    const { backupCode } = request.body;

    if (!(await verifyBackupCode(userId, backupCode))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid backup code"
      );
    }

    const { username } = await getUser(userId);
    const payload = await getTokenData(username, "username");
    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    reply.clearCookie("twoFALoginToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/2fa/login/"
    });
    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: { username: username }
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFALoginVerifyHandler(request, reply) {
  const action = "Verify 2FA Code during login";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA code can not be verified. User uses Google auth provider"
      );
    }

    const { code } = request.body;
    const secret = await getTotpSecret(userId);
    const totp = generateTotp(request.user.username, secret);
    if (!verify2FaToken(totp, code)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid 2FA code"
      );
    }

    const { username } = await getUser(userId);
    const payload = await getTokenData(username, "username");
    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    reply.clearCookie("twoFALoginToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/2fa/login/"
    });
    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: { username: username }
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFAStatusHandler(request, reply) {
  const action = "Get 2FA status";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA code can not be verified. User uses Google auth provider"
      );
    }

    const hasTwoFA = await get2FaStatus(userId);
    const data = { hasTwoFA: hasTwoFA };
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFARemoveHandler(request, reply) {
  const action = "Remove 2FA";
  try {
    const userId = request.user.id;
    if ((await getUserAuthProvider(userId)) !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "2FA code can not be verified. User uses Google auth provider"
      );
    }

    const { password } = request.body;
    const hashedPassword = await getPasswordHash(userId);

    if (!(await verifyHash(hashedPassword, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    await update2FaStatus(userId, false);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true) });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `RefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function logoutUserHandler(request, reply) {
  const action = "Logout user";
  try {
    const userId = parseInt(request.user.id, 10);
    const username = request.user.username;
    reply.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });
    reply.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh"
    });
    await deleteUserRefreshToken(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: { username: username }
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `logoutUserHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
