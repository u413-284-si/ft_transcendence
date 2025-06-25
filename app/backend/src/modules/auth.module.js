import fastifyRateLimit from "@fastify/rate-limit";
import authRoutes from "../routes/auth.routes.js";

export default async function authModule(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: 10,
    timeWindow: "1 minute"
  });

  await fastify.register(authRoutes, { prefix: "/auth" });
}
