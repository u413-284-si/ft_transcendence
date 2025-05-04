import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyStoredRefreshToken
} from "../services/auth.services.js";
import { getUserData, getUserID } from "../services/users.services.js";
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

    if (!(await verifyPassword(hashedPassword, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    const accessToken = createAccessToken(userDataAccessToken);
    const refreshToken = createRefreshToken(userDataRefreshToken);

    const newHashedRefreshToken = await createHashedRefreshToken(refreshToken);

    await updateUserRefreshToken(
      userDataRefreshToken.id,
      newHashedRefreshToken
    );

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
    const userDataRefreshToken = verifyRefreshToken(token);
    const userId = userDataRefreshToken.id;

    const userData = await getUserData(userId);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authentication: { hashedPassword, hashedRefreshToken },
      ...userDataAccessToken
    } = userData;

    if (!(await verifyStoredRefreshToken(hashedRefreshToken, token))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid refresh token"
      );
    }

    const accessToken = createAccessToken(userDataAccessToken);
    const refreshToken = createRefreshToken(userDataRefreshToken);

    const hashedRefreshTokenNew = await createHashedRefreshToken(
      refreshToken.token
    );

    await updateUserRefreshToken(
      userDataRefreshToken.id,
      hashedRefreshTokenNew
    );

    request.user = userDataAccessToken;
    setAuthCookies(reply, accessToken, refreshToken);
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
