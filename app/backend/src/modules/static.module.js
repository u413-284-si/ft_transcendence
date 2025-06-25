import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import env from "../config/env.js";

export default async function staticModule(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: env.staticRateLimitMax,
    timeWindow: env.staticRateLimitTimeInMS
  });

  await fastify.register(fastifyStatic, {
    root: "/workspaces/ft_transcendence/app/frontend/public",
    // By default all assets are immutable and can be cached for a long period due to cache bursting techniques
    wildcard: false,
    maxAge: "30d",
    immutable: true,
    prefix: "/static/"
  });

  // Explicitly reduce caching of assets that don't use cache bursting techniques
  fastify.get("/", function (req, reply) {
    // index.html should never be cached
    reply.sendFile("index.html", {
      root: "/workspaces/ft_transcendence/app/frontend/public",
      maxAge: 0,
      immutable: false
    });
  });

  fastify.get("/favicon.ico", function (req, reply) {
    // favicon can be cached for a short period
    reply.sendFile("favicon.ico", {
      root: "/workspaces/ft_transcendence/app/frontend/public",
      maxAge: "1d",
      immutable: false
    });
  });

  fastify.setNotFoundHandler((req, reply) => {
    return reply.status(200).sendFile("index.html");
  });
}
