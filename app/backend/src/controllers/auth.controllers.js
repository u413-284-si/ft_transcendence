import { getUserPassword } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { httpError } from "../utils/error.js";
import { verifyPassword } from "../services/auth.services.js";
import { createAccessToken } from "../services/auth.services.js";

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
    console.log("user:", data);

    const timeSpan = 15 * 60;
    const inFifteenMinutes = new Date(new Date().getTime() + timeSpan * 1000);
    const JWTAccessToken = createAccessToken(data, timeSpan);

    return reply
      .setCookie("authToken", JWTAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: inFifteenMinutes
      })
      .code(200)
      .send({
        message: createResponseMessage(action, true),
        username: data.username
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

export async function authAndDecodeHandler(request, reply) {
  const action = "Auth and decode";
  try {
    const data = request.user;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `authAndDecodeHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
