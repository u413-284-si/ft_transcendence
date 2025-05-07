import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  updateUserRefreshToken,
  verifyHash,
  createHash,
  createAuthTokens
} from "../services/auth.services.js";
import { getUserData, getUserID } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { setAuthCookies } from "../utils/cookie.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const userId = getUserID(usernameOrEmail);

    const userData = await getUserData(userId);
    const {
      authentication: {
        password: hashedPassword,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refreshToken: hashedRefreshToken
      },
      ...userDataAccessToken
    } = userData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, ...userDataRefreshToken } = userDataAccessToken;

    // @TODO: rename function to verifyHash (can be used for login and refresh token)
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
      userDataAccessToken,
      userDataRefreshToken
    );
    request.user = userDataAccessToken;
    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: { username: userDataAccessToken.username }
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
    const userDataRefreshToken = await verifyRefreshToken(request, token);
    const userId = userDataRefreshToken.id;

    const userData = await getUserData(userId);
    const {
      authentication: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password: hashedPassword,
        refreshToken: hashedRefreshToken
      },
      ...userDataAccessToken
    } = userData;

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
      userDataAccessToken,
      userDataRefreshToken
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
