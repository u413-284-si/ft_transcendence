import fastifyRateLimit from "@fastify/rate-limit";
import authRoutes from "./auth.routes.js";
import matchRoutes from "./matches.routes.js";
import tournamentRoutes from "./tournaments.routes.js";
import userstatsRoutes from "./user_stats.routes.js";
import userRoutes from "./users.routes.js";
import { authorizeUserAccess } from "../middleware/auth.js";

export default async function apiRoutes(fastify) {
  fastify.addHook("onRequest", authorizeUserAccess);
  await fastify.register(fastifyRateLimit, {
    max: 50,
    timeWindow: "1 minute"
  });
  await fastify.register(userRoutes, { prefix: "/api/users" });
  await fastify.register(matchRoutes, { prefix: "/api/matches" });
  await fastify.register(tournamentRoutes, { prefix: "/api/tournaments" });
  await fastify.register(authRoutes, { prefix: "/api/auth" });
  await fastify.register(userstatsRoutes, { prefix: "/api/user-stats" });
}
