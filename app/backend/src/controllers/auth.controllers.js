import pkg from "argon2";
import { authorizeUser } from "../services/auth.services.js";
import { getUserPassword } from "../services/users.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/jwt.js";
import { httpError } from "../utils/error.js";

export async function loginUserHandler(request, reply) {
  const action = "Login user";
  try {
    const { usernameOrEmail, password } = request.body;

    const data = await getUserPassword(usernameOrEmail);

    if (!(await pkg.verify(data.authentication.password, password)))
      return httpError(
        reply,
        401,
        createResponseMessage(action, false),
        "Wrong credentials"
      );

    delete data.authentication;
    console.log("user:", data);

    const JWTAccessToken = jwt.sign(data, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "15m"
    });
    const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

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
    handlePrismaError(reply, action, err);
  }
}

export async function authorizeUserHandler(request, reply) {
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
    const data = authorizeUser(token);
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
