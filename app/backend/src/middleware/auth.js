import { verifyJWT } from "../services/auth.services.js";
import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";

export async function authorizeUser(request, reply) {
  const action = "authorize user";
  const token = request.cookies.authToken;
  if (!token) {
    return httpError(
      reply,
      401,
      createResponseMessage(action, false),
      "No token provided"
    );
  }
  try {
    const data = verifyJWT(token);
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
