import {
  getPasswordHash,
  verifyHash,
  createAuthTokens,
  getTokenHash,
  deleteUserRefreshToken,
  updateTwoFASecret,
  generateTwoFA,
  generateTwoFAQRCode,
  generateTwoFASecret,
  verifyTwoFACode,
  getTwoFASecret,
  updateTwoFAStatus,
  getTwoFAStatus,
  createTwoFAToken,
  deleteBackupCodes,
  verifyBackupCode,
  updateBackupCodes
} from "../services/auth.services.js";
import {
  getTokenData,
  getUserByEmail,
  getUserByUsername,
  createRandomUsername,
  isUserNameValid
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

    const hasTwoFA = await getTwoFAStatus(payload.id);
    if (hasTwoFA) {
      const twoFALoginToken = await createTwoFAToken(reply, payload);
      return reply
        .setTwoFACookie(twoFALoginToken)
        .code(200)
        .send({
          message: createResponseMessage(action, true),
          data: { username: payload.username, hasTwoFA: hasTwoFA, token: null }
        });
    }

    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    request.cookies.accessToken = accessToken;
    const decodedAccessToken = await request.accessTokenDecode();

    return reply
      .setAuthCookies(accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: {
          username: payload.username,
          hasTwoFA: hasTwoFA,
          token: {
            status: "valid",
            type: decodedAccessToken.type,
            exp: decodedAccessToken.exp
          }
        }
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

    return reply
      .setAuthCookies(accessToken, refreshToken)
      .redirect("http://localhost:4000/home");
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `oAuth2LoginUserHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function checkRefreshTokenStatusHandler(request, reply) {
  const action = "Check refresh token status";
  try {
    const payload = await request.refreshTokenVerify();
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: { status: "valid", type: payload.type, exp: payload.exp }
    });
  } catch (err) {
    let status = "undefined";
    if (err.code === "FST_JWT_NO_AUTHORIZATION_IN_COOKIE") {
      status = "none";
    } else if (err.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
      status = "expired";
    } else if (
      err.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID" ||
      err.code === "FST_JWT_AUTHORIZATION_TOKEN_UNTRUSTED" ||
      err.code === "FAST_JWT_MISSING_SIGNATURE"
    ) {
      status = "invalid";
    } else {
      throw err;
    }
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: { status }
    });
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

    const userDataRefreshToken = await request.refreshTokenVerify();
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
    request.cookies.accessToken = accessToken;
    const decodedAccessToken = await request.accessTokenDecode();
    return reply
      .setAuthCookies(accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: {
          status: "valid",
          type: decodedAccessToken.type,
          exp: decodedAccessToken.exp
        }
      });
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
    if (await getTwoFAStatus(userId)) {
      secret = await getTwoFASecret(request.user.id);
    } else {
      secret = generateTwoFASecret();
      await updateTwoFASecret(userId, secret);
    }

    const twoFA = generateTwoFA(username, secret);
    const qrcode = await generateTwoFAQRCode(twoFA);
    const data = { qrcode: qrcode };

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `twoFAQRCodeHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function enableTwoFAHandler(request, reply) {
  const action = "Enable 2FA";
  try {
    const userId = request.user.id;

    const { code } = request.body;
    const secret = await getTwoFASecret(userId);
    const twoFA = generateTwoFA(request.user.username, secret);
    if (!verifyTwoFACode(twoFA, code)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid 2FA code"
      );
    }

    await updateTwoFAStatus(userId, true);

    const newBackupCodes = await updateBackupCodes(userId);
    const data = { backupCodes: newBackupCodes };

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `enableTwoFAHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFABackupCodesHandler(request, reply) {
  const action = "Generate backup codes";
  try {
    const userId = request.user.id;

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

    const newBackupCodes = await updateBackupCodes(userId);
    const data = { backupCodes: newBackupCodes };

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (error) {
    request.log.error(
      { error, body: request.body },
      `twoFABackupCodesHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, error);
  }
}

export async function twoFABackupCodeVerifyHandler(request, reply) {
  const action = "Verify backup codes";
  try {
    const userId = request.user.id;
    const username = request.user.username;

    const { backupCode } = request.body;

    if (!(await verifyBackupCode(userId, backupCode))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid backup code"
      );
    }

    const payload = { id: userId, username: username };
    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    request.cookies.accessToken = accessToken;
    const decodedAccessToken = await request.accessTokenDecode();
    reply.clearCookie("twoFALoginToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/2fa/login/"
    });
    return reply
      .setAuthCookies(accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: {
          username: username,
          token: {
            status: "valid",
            type: decodedAccessToken.type,
            exp: decodedAccessToken.exp
          }
        }
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `twoFABackupCodeVerifyHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFALoginVerifyHandler(request, reply) {
  const action = "Verify 2FA Code during login";
  try {
    const userId = request.user.id;
    const username = request.user.username;

    const { code } = request.body;
    const secret = await getTwoFASecret(userId);
    const twoFA = generateTwoFA(request.user.username, secret);
    if (!verifyTwoFACode(twoFA, code)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid 2FA code"
      );
    }

    const payload = { id: userId, username: username };
    const { accessToken, refreshToken } = await createAuthTokens(
      reply,
      payload
    );
    request.cookies.accessToken = accessToken;
    const decodedAccessToken = await request.accessTokenDecode();
    reply.clearCookie("twoFALoginToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/2fa/login/"
    });
    return reply
      .setAuthCookies(accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: {
          username: username,
          token: {
            status: "valid",
            type: decodedAccessToken.type,
            exp: decodedAccessToken.exp
          }
        }
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `twoFALoginVerifyHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFAStatusHandler(request, reply) {
  const action = "Get 2FA status";
  try {
    const userId = request.user.id;

    const hasTwoFA = await getTwoFAStatus(userId);
    const data = { hasTwoFA: hasTwoFA };
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `twoFAStatusHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function twoFARemoveHandler(request, reply) {
  const action = "Remove 2FA";
  try {
    const userId = request.user.id;

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

    await updateTwoFAStatus(userId, false);
    await updateTwoFASecret(userId, null);
    await deleteBackupCodes(userId);
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
    const userId = request.user.id;
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
