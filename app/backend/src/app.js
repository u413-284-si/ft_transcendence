import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import fastifyStatic from "@fastify/static";

import env from "./config/env.js";

import userRoutes from "./routes/users.routes.js";
import staticRoutes from "./routes/static.routes.js";
import matchRoutes from "./routes/matches.routes.js";

import { commonSchemas } from "./schema/common.schema.js";
import { userSchemas } from "./schema/users.schema.js";
import { matchSchemas } from "./schema/matches.schema.js";

const fastify = Fastify({
  logger: {
    level: env.logLevel,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z"
      }
    },
    formatters: {
      bindings: () => {
        return {};
      }
    }
  },
  ajv: {
    customOptions: {
      strict: true
    }
  }
});

await fastify.register(fastifyCors);
await fastify.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:4000"]
    }
  }
});
await fastify.register(fastifyCompress);
await fastify.register(fastifyGracefulShutdown);
await fastify.register(fastifyFormbody);

for (const schema of [...commonSchemas, ...userSchemas, ...matchSchemas]) {
  fastify.addSchema(schema);
}

await fastify.register(staticRoutes);
await fastify.register(userRoutes, { prefix: "/api/users" });
await fastify.register(matchRoutes, { prefix: "/api/matches" });
await fastify.register(fastifyStatic, {
  root: "/workspaces/ft_transcendence/app/frontend/public"
});

fastify.listen({ host: "0.0.0.0", port: env.port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Pong game is running in ${env.nodeEnv} mode at ${address}`);
});
