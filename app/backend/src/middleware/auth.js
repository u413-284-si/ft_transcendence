import { verifyAccessToken } from "../services/auth.services.js";
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
    const userData = await verifyAccessToken(request);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authentication, ...userDataAccessToken } = userData;
    request.user = userDataAccessToken;
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authorizeUserHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
