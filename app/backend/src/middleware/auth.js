import {
  verifyAccessToken,
  verifyTwoFALoginToken
} from "../services/auth.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError, httpError } from "../utils/error.js";
import { getUserAuthProvider } from "../services/users.services.js";

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
    await verifyAccessToken(request);
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserAccess: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function authorizeUserTwoFALogin(request, reply) {
  const action = "Authorize user's two factor login token";

  const token = request.cookies.twoFALoginToken;
  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No token provided"
    );
  }
  try {
    await verifyTwoFALoginToken(request);
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserTwoFALoginAccess: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function ensureLocalAuthProvider(request, reply) {
  const action = "Ensure local auth provider";
  try {
    const userId = request.user.id;
    const provider = await getUserAuthProvider(userId);

    if (provider !== "LOCAL") {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        `2FA operation can not be performed. User uses ${provider} auth provider`
      );
    }
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `ensureLocalAuthProvider: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
