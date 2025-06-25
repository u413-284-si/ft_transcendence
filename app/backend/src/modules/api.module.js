import fastifyRateLimit from "@fastify/rate-limit";
import matchRoutes from "../routes/matches.routes.js";
import tournamentRoutes from "../routes/tournaments.routes.js";
import userstatsRoutes from "../routes/user_stats.routes.js";
import userRoutes from "../routes/users.routes.js";
import authModule from "./auth.module.js";

export default async function apiModule(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: 50,
    timeWindow: "1 minute",
    hook: "preHandler",
    keyGenerator: function (request) {
      return request.user?.id ?? request.ip;
    }
  });

  await fastify.register(authModule);

  await fastify.register(userRoutes, { prefix: "/users" });
  await fastify.register(matchRoutes, { prefix: "/matches" });
  await fastify.register(tournamentRoutes, { prefix: "/tournaments" });
  await fastify.register(userstatsRoutes, { prefix: "/user-stats" });
}
