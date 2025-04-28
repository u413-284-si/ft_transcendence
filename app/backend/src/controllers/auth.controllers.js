import {
  createAccessToken,
  createRefreshToken
} from "../services/auth.services.js";
import {
  getUserDataForAccessToken,
  getUserDataForRefreshToken,
  getUserPassword,
  getUserID
} from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { verifyPassword } from "../services/auth.services.js";
import { setAuthCookies } from "../utils/cookie.js";
import { createHashedRefreshToken } from "../services/auth.services.js";
import { updateUserRefreshToken } from "../services/users.services.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const userId = getUserID(usernameOrEmail);
    const passwordDatabase = await getUserPassword(userId);

    const userDataAccessToken = await getUserDataForAccessToken(userId);
    const userDataRefreshToken = await getUserDataForRefreshToken(userId);

    if (!(await verifyPassword(passwordDatabase, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    const accessTokenTimeToExpireJWT = 15 * 60; // 15 Minutes
    const refreshTokenTimeToExpireJWT = 24 * 60 * 60; // 1 day

    const accessToken = createAccessToken(
      userDataAccessToken,
      accessTokenTimeToExpireJWT
    );
    const refreshToken = createRefreshToken(
      userDataRefreshToken,
      refreshTokenTimeToExpireJWT
    );

    const hashedRefreshToken = await createHashedRefreshToken(
      refreshToken.token
    );

    await updateUserRefreshToken(userDataRefreshToken.id, hashedRefreshToken);

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

export async function authAndDecodeRefreshHandler(request, reply) {
  const action = "Auth and decode refresh token";
  try {
    const data = request.user;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authAndDecodeRefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
