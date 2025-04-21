import {
  verifyAccessToken,
  verifyRefreshToken,
  verifyStoredRefreshToken
} from "../services/auth.services.js";
import { createAccessAndRefreshToken } from "../services/auth.services.js";
import {
  getRefreshToken,
  deleteUserRefreshToken
} from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";
import { createHashedRefreshToken } from "../services/auth.services.js";
import { addUserRefreshToken } from "../services/users.services.js";
import { setAuthCookies } from "../utils/cookie.js";

export async function authorizeUserAccess(request, reply) {
  const action = "Authorize user access";
  const token = request.cookies.accessToken;
  console.log("cookies", request.cookies);
  console.log("token", token);
  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No token provided"
    );
  }
  try {
    const data = verifyAccessToken(token);
    request.user = data;
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserHandler: ${createResponseMessage(action, false)}`
    );
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "Could not verify JWT"
    );
  }
}

export async function authorizeUserRefresh(request, reply) {
  const action = "Authorize user refresh";
  const token = request.cookies.refreshToken;
  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No refresh token provided"
    );
  }
  try {
    const data = verifyRefreshToken(token);
    const hashedRefreshTokenDatabase = await getRefreshToken(data.id);

    if (!verifyStoredRefreshToken(hashedRefreshTokenDatabase, token)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid refresh token"
      );
    }

    delete data.exp;
    delete data.iat;

    const { accessToken, refreshToken } = createAccessAndRefreshToken(data);
    const hashedRefreshTokenRequest = await createHashedRefreshToken(
      refreshToken.token
    );

    await deleteUserRefreshToken(data.id);
    await addUserRefreshToken(data.id, hashedRefreshTokenRequest);

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
