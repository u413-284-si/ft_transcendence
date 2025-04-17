import {
  authAndDecodeHandler,
  loginUserHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import { authorizeUser } from "../middleware/auth.js";

export default async function authRoutes(fastify) {
  fastify.post("/", optionsloginUser, loginUserHandler);

  fastify.get("/", optionsAuthUser, authAndDecodeHandler);
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

const optionsAuthUser = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      ...errorResponses
    }
  }
};
