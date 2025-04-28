import {
  verifyAccessToken,
  verifyRefreshToken,
  verifyStoredRefreshToken,
  decodeToken,
  createAccessToken,
  createRefreshToken
} from "../services/auth.services.js";
import {
  getRefreshToken,
  getUserDataForAccessToken,
  getUserDataForRefreshToken
} from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";
import { createHashedRefreshToken } from "../services/auth.services.js";
import { updateUserRefreshToken } from "../services/users.services.js";
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
    verifyAccessToken(token);

    if (!("id" in decodeToken(token).payload)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid payload"
      );
    }

    const userId = decodeToken(token).payload.id;
    const userData = await getUserDataForAccessToken(userId);
    request.user = userData;
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
    verifyRefreshToken(token);

    if (!("id" in decodeToken(token).payload)) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid payload"
      );
    }

    const userId = decodeToken(token).payload.id;
    const userDataRefreshToken = getUserDataForRefreshToken(userId);
    const hashedRefreshTokenDatabase = await getRefreshToken(
      userDataRefreshToken.id
    );

    if (!(await verifyStoredRefreshToken(hashedRefreshTokenDatabase, token))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Invalid refresh token"
      );
    }

    delete userDataRefreshToken.exp;
    delete userDataRefreshToken.iat;

    const accessTokenTimeToExpireJWT = 15 * 60; // 15 Minutes
    const refreshTokenTimeToExpireJWT = 24 * 60 * 60; // 1 day

    const userDataAccessToken = getUserDataForAccessToken(userId);
    const accessToken = createAccessToken(
      userDataAccessToken,
      accessTokenTimeToExpireJWT
    );
    const refreshToken = createRefreshToken(
      userDataRefreshToken,
      refreshTokenTimeToExpireJWT
    );
    console.log("refreshToken: ", refreshToken);
    const hashedRefreshTokenNew = await createHashedRefreshToken(
      refreshToken.token
    );

    await updateUserRefreshToken(
      userDataRefreshToken.id,
      hashedRefreshTokenNew
    );

    request.user = userDataAccessToken;
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
