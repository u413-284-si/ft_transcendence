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
  fastify.get("/", function (request, reply) {
    // index.html should never be cached
    reply.sendFile("index.html", {
      maxAge: 0,
      immutable: false
    });
  });

  fastify.get("/favicon.ico", function (request, reply) {
    // favicon can be cached for a short period
    reply.sendFile("favicon.ico", {
      maxAge: "1d",
      immutable: false
    });
  });

  fastify.setNotFoundHandler(function (request, reply) {
    request.log.info("Static NotFoundHandler");
    return reply.status(200).sendFile("index.html", {
      maxAge: 0,
      immutable: false
    });
  });

  fastify.setErrorHandler((error, request, reply) => {
    if (error.statusCode === 429) {
      const accept = request.headers["accept"] || "";
      if (accept.includes("text/html")) {
        reply.code(429).type("text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Too Many Requests</title>
          </head>
          <body>
            <h1>Whoa, slow down!</h1>
            <p>You've made too many requests in a short time.</p>
          </body>
        </html>
      `);
      }
    } else {
      reply.send(error);
    }
  });
}
