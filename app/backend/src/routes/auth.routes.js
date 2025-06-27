import {
  authAndDecodeAccessHandler,
  authRefreshHandler,
  loginUserHandler,
  logoutUserHandler,
  googleOauth2LoginHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import env from "../config/env.js";
import fastifyRateLimit from "@fastify/rate-limit";

export default async function authRoutes(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: env.authRateLimitMax,
    timeWindow: env.authRateLimitTimeInMS,
    hook: "preHandler",
    keyGenerator: function (request) {
      return request.user?.id ?? request.ip;
    },
    onExceeded: (request) => {
      if (request.user?.id) {
        request.log.warn(
          `Rate limit exceeded for user id: ${request.user.id} - URL: ${request.raw.url}`
        );
      } else {
        request.log.warn(
          `Rate limit exceeded for IP: ${request.ip} - URL: ${request.raw.url}`
        );
      }
    }
  });
  fastify.post("/", optionsloginUser, loginUserHandler);

  fastify.get("/", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authRefreshHandler);

  fastify.patch("/logout/", optionsLogoutUser, logoutUserHandler);

  fastify.get(
    env.googleOauth2CallbackRoute,
    optionsGoogleOauth2Login,
    googleOauth2LoginHandler
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

const optionsAuthUserAccess = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUserRefresh = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsLogoutUser = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "loginUserResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGoogleOauth2Login = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};
