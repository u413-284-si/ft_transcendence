import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import env from "../config/env.js";

export default async function staticModule(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: env.staticRateLimitMax,
    timeWindow: env.staticRateLimitTimeInMS
  });

  await fastify.register(fastifyStatic, {
    root: "/workspaces/ft_transcendence/app/frontend/public"
  });

  fastify.setNotFoundHandler((req, reply) => {
    if (req.raw.url && req.raw.url.startsWith("/api")) {
      return reply.status(404).send({
        message: `Fail: ${req.raw.url}`,
        cause: "Route does not exist"
      });
    }
    return reply.status(200).sendFile("index.html");
  });
}
