import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import env from "../config/env.js";
import path from "path";

export default async function staticModule(fastify) {
  await fastify.register(fastifyRateLimit, {
    max: env.staticRateLimitMax,
    timeWindow: env.staticRateLimitTimeInMS,
    onExceeded: (request) => {
      request.log.warn(
        `Rate limit exceeded for IP: ${request.ip} - URL: ${request.raw.url}`
      );
    }
  });

  const __dirname = import.meta.dirname;

  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "..", "frontend", "public"),
    cacheControl: false,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store");
    }
  });

  fastify.setNotFoundHandler(function (request, reply) {
    request.log.info("Static NotFoundHandler");
    if (request.raw.url && request.raw.url.startsWith("/api")) {
      return reply.status(404).send({
        message: `Fail: ${request.raw.url}`,
        cause: "Route does not exist"
      });
    }
    return reply.status(200).sendFile("index.html");
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
