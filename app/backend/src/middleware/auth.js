import { verifyAccessToken, decodeToken } from "../services/auth.services.js";
import { getUserData } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";

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
    const userData = await getUserData(userId);
    const { _password, ...userDataAccessToken } = userData;
    request.user = userDataAccessToken;
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
