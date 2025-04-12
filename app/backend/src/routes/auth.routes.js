import {
  authorizeUserHandler,
  loginUserHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";

export async function authRoutes(fastify) {
  fastify.post("/", optionsloginUser, loginUserHandler);

  fastify.get("/", authorizeUserHandler);
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
