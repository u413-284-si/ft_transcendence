import {
  authAndDecodeAccessHandler,
  authAndDecodeRefreshHandler,
  loginUserHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import {
  authorizeUserAccess,
  authorizeUserRefresh
} from "../middleware/auth.js";

export default async function authRoutes(fastify) {
  fastify.post("/", optionsloginUser, loginUserHandler);

  fastify.get("/", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authAndDecodeRefreshHandler);
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

const optionsAuthUserAccess = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUserRefresh = {
  onRequest: [authorizeUserRefresh],
  schema: {
    response: {
      ...errorResponses
    }
  }
};
