import {
  verifyAccessToken,
  verifyTwoFaloginToken
} from "../services/auth.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError, httpError } from "../utils/error.js";

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
      `authorizeUserHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function authorizeUserTwoFaTempAccess(request, reply) {
  const action = "Authorize user's two factor temp token";

  const token = request.cookies.twoFaloginToken;
  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No token provided"
    );
  }
  try {
    await verifyTwoFaloginToken(request);
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
