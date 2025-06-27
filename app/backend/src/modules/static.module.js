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
    wildcard: false,
    prefix: "/static/"
  });

  fastify.get("/", function (request, reply) {
    reply.sendFile("index.html", {});
  });

  fastify.get("/favicon.ico", function (request, reply) {
    reply.sendFile("favicon.ico", {});
  });

  fastify.setNotFoundHandler(function (request, reply) {
    request.log.info("Static NotFoundHandler");
    return reply.status(200).sendFile("index.html", {});
  });

  fastify.setErrorHandler(function (error, request, reply) {
    const accept = request.headers["accept"] || "";
    if (error.statusCode === 429 && accept.includes("text/html")) {
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
    } else {
      reply.send(error);
    }
  });
}
