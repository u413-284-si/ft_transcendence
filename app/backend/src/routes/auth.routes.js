import {
  authAndDecodeAccessHandler,
  authRefreshHandler,
  loginUserHandler,
  oAuth2LoginUserHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import env from "../config/env.js";

export default async function authRoutes(fastify) {
  fastify.post("/", optionsloginUser, loginUserHandler);

  fastify.get("/", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authRefreshHandler);

  fastify.get(env.oAuth2CallbackUrl, oAuth2LoginUserHandler);
}

const authRateLimit = {
  max: 10, // Maximum 10 requests
  timeWindow: "1 minute" // Per minute
};

const optionsloginUser = {
  schema: {
    body: { $ref: "loginUserSchema" },
    response: {
      200: { $ref: "loginUserResponseSchema" },
      ...errorResponses
    }
  },
  rateLimit: authRateLimit
};

const optionsAuthUserAccess = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  },
  rateLimit: authRateLimit
};

const optionsAuthUserRefresh = {
  schema: {
    response: {
      ...errorResponses
    }
  },
  rateLimit: authRateLimit
};
