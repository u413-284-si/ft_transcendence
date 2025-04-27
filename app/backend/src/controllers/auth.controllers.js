import { createAccessAndRefreshToken } from "../services/auth.services.js";
import { getUserPassword } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { verifyPassword } from "../services/auth.services.js";
import { setAuthCookies } from "../utils/cookie.js";
import { createHashedRefreshToken } from "../services/auth.services.js";
import { updateUserRefreshToken } from "../services/users.services.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const data = await getUserPassword(usernameOrEmail);

    if (!(await verifyPassword(data.authentication.password, password))) {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }

    delete data.authentication;

    const { accessToken, refreshToken } = createAccessAndRefreshToken(data);

    const hashedRefreshToken = await createHashedRefreshToken(
      refreshToken.token
    );

    await updateUserRefreshToken(data.id, hashedRefreshToken);

    return setAuthCookies(reply, accessToken, refreshToken)
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        data: { username: data.username }
      });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `loginUserHandler: ${createResponseMessage(action, false)}`
    );
    if (err.code === "P2025") {
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );
    }
    handlePrismaError(reply, action, err);
  }
}

export async function authAndDecodeAccessHandler(request, reply) {
  const action = "Auth and decode access token";
  try {
    const data = request.user;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authAndDecodeAccessHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function authAndDecodeRefreshHandler(request, reply) {
  const action = "Auth and decode refresh token";
  try {
    const data = request.user;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authAndDecodeRefreshHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
