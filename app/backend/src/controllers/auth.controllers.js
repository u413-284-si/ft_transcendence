import {
  getPasswordHash,
  verifyRefreshToken,
  verifyHash,
  createAuthTokens,
  getTokenHash
} from "../services/auth.services.js";
import { getTokenData } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { setAuthCookies } from "../utils/cookie.js";
import fastify from "../app.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const identifier = usernameOrEmail.includes("@") ? "email" : "username";
    const payload = await getTokenData(usernameOrEmail, identifier);

    const hashedPassword = await getPasswordHash(payload.id);

    if (!(await verifyHash(hashedPassword, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
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

export async function oAuth2LoginUserHandler(request, reply) {
  const action = "OAuth2 login user";
  try {
    const { token } =
      await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );
    console.log("token: ", token);
    return;
    // const { accessToken, refreshToken } = await createAuthTokens(
    //   reply,
    //   request.user
    // );
    // return setAuthCookies(reply, accessToken, refreshToken)
    //   .code(200)
    //   .send({ message: createResponseMessage(action, true) });
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
