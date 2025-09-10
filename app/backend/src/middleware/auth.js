import { HttpError } from "../utils/error.js";
import { getUserAuthProvider } from "../services/users.services.js";

export async function authorizeUserAccess(request) {
  request.action = "Authorize user's access token";
  await request.accessTokenVerify();
}

export async function authorizeUserTwoFALogin(request) {
  request.action = "Authorize user's twoFA login token";
  await request.twoFALoginTokenVerify();
}

export async function ensureLocalAuthProvider(request) {
  request.action = "Ensure local auth provider";
  const userId = request.user.id;
  const provider = await getUserAuthProvider(userId);

  if (provider !== "LOCAL") {
    throw new HttpError(
      403,
      `Operation can not be performed: uses ${provider} auth provider`
    );
  }
}
