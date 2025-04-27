import {
  verifyAccessToken,
  verifyRefreshToken,
  verifyStoredRefreshToken,
  decodeAccessToken
} from "../services/auth.services.js";
import { createAccessAndRefreshToken } from "../services/auth.services.js";
import { getRefreshToken } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";
import { createHashedRefreshToken } from "../services/auth.services.js";
import { addUserRefreshToken } from "../services/users.services.js";
import { setAuthCookies } from "../utils/cookie.js";

export async function authorizeUserAccess(request, reply) {
  const action = "Authorize user's access token";
  const token = request.cookies.accessToken;
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
  const action = "Authorize user's refresh token";
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

    const userData = decodeAccessToken(token).payload;
    delete userData.exp;
    delete userData.iat;

    const { accessToken, refreshToken } = createAccessAndRefreshToken(userData);
    const hashedRefreshTokenRequest = await createHashedRefreshToken(
      refreshToken.token
    );

    await addUserRefreshToken(userData.id, hashedRefreshTokenRequest);

    request.user = userData;
    setAuthCookies(reply, accessToken, refreshToken);
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
