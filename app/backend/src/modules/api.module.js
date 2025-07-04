import fastifyRateLimit from "@fastify/rate-limit";
import authModule from "./auth.module.js";
import matchRoutes from "../routes/matches.routes.js";
import tournamentRoutes from "../routes/tournaments.routes.js";
import userstatsRoutes from "../routes/user_stats.routes.js";
import userRoutes from "../routes/users.routes.js";
import env from "../config/env.js";

export default async function apiModule(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: env.apiRateLimitMax,
    timeWindow: env.apiRateLimitTimeInMS,
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

  await fastify.register(authModule);

  await fastify.register(userRoutes, { prefix: "/users" });
  await fastify.register(matchRoutes, { prefix: "/matches" });
  await fastify.register(tournamentRoutes, { prefix: "/tournaments" });
  await fastify.register(userstatsRoutes, { prefix: "/user-stats" });
}
