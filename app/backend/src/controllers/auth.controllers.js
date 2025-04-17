import {
  authorizeUserAccess,
  authorizeUserRefresh,
  createAccessAndRefreshToken,
  verifyRefreshToken
} from "../services/auth.services.js";
import {
  deleteUserRefreshToken,
  getUserPassword,
  getRefreshToken
} from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { verifyPassword } from "../services/auth.services.js";
import { setAuthCookies } from "../utils/cookie.js";
import { createHashedRefreshToken } from "../services/auth.services.js";
import { addUserRefreshToken } from "../services/users.services.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const data = await getUserPassword(usernameOrEmail);

    if (!(await verifyPassword(data.authentication.password, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    delete data.authentication;

    const { accessToken, refreshToken } = createAccessAndRefreshToken(data);

    const hashedRefreshToken = await createHashedRefreshToken(
      refreshToken.token
    );

    await addUserRefreshToken(data.id, hashedRefreshToken);

    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        username: data.username
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

export async function authorizeUserAccessHandler(request, reply) {
  const action = "authorize user";
  const token = request.cookies.accessToken;

  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No access token provided"
    );
  }
  try {
    const data = authorizeUserAccess(token);
    request.user = data;
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserAccessHandler: ${createResponseMessage(action, false)}`
    );
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "Could not verify JWT"
    );
  }
}

export async function authorizeUserRefreshHandler(request, reply) {
  const action = "authorize user";
  const token = request.cookies.refreshToken;
  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No token provided"
    );
  }
  try {
    const data = authorizeUserRefresh(token);

    delete data.exp;
    delete data.iat;

    console.log("data:", data);

    const { accessToken, refreshToken } = createAccessAndRefreshToken(data);
    const hashedRefreshTokenDatabase = await getRefreshToken(data.id);
    const hashedRefreshTokenRequest = await createHashedRefreshToken(
      refreshToken.token
    );

    if (
      !(await verifyRefreshToken(
        hashedRefreshTokenDatabase,
        hashedRefreshTokenRequest
      ))
    ) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid refresh token"
      );
    }

    await deleteUserRefreshToken(data.id);
    await addUserRefreshToken(data.id, refreshToken.token);

    request.user = data;
    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        username: data.username
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserRefreshHandler: ${createResponseMessage(action, false)}`
    );
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "Could not verify JWT"
    );
  }
}
