import {
  authorizeUserAccessHandler,
  loginUserHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function authRoutes(fastify) {
  fastify.post("/", optionsloginUser, loginUserHandler);

  fastify.get("/", authorizeUserAccessHandler);
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
