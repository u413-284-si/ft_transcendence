import { createResponseMessage } from "../utils/response.js";
import { httpError } from "../utils/error.js";
import { getUserAuthProvider } from "../services/users.services.js";

export async function authorizeUserAccess(request, reply) {
  request.action = "Authorize user's access token";
  await request.accessTokenVerify();
}

export async function authorizeUserTwoFALogin(request, reply) {
  request.action = "Authorize user's twoFA login token";
  await request.twoFALoginTokenVerify();
}

export async function ensureLocalAuthProvider(request, reply) {
  request.action = "Ensure local auth provider";
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
}
