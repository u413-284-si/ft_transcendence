import {
  authorizeUserHandler,
  loginUserHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function authRoutes(fastify) {
  fastify.post(
    "/",
    optionsloginUser,
    { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    loginUserHandler
  );

  fastify.get(
    "/",
    { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    authorizeUserHandler
  );
}

const optionsloginUser = {
  schema: {
    body: { $ref: "loginUserSchema" },
    response: {
      200: { $ref: "loginUserResponseSchema" },
      ...errorResponses
    }
  }
};
