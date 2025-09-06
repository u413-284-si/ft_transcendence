import fastifyRateLimit from "@fastify/rate-limit";
import env from "../config/env.js";
import authRoutes from "../routes/auth.routes.js";
import {
  clearAuthCookies,
  setAuthCookies,
  setTwoFACookie
} from "../services/auth.services.js";

export default async function authModule(fastify) {
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

  await fastify.register(authRoutes, { prefix: "/auth" });
  fastify.decorateReply("setAuthCookies", setAuthCookies);
  fastify.decorateReply("setTwoFACookie", setTwoFACookie);
}
