import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import fastifyRateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";

import env from "./config/env.js";

import userRoutes from "./routes/users.routes.js";
import staticRoutes from "./routes/static.routes.js";
import matchRoutes from "./routes/matches.routes.js";
import tournamentRoutes from "./routes/tournaments.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userstatsRoutes from "./routes/user_stats.routes.js";

import { commonSchemas } from "./schema/common.schema.js";
import { userSchemas } from "./schema/users.schema.js";
import { matchSchemas } from "./schema/matches.schema.js";
import { tournamentSchemas } from "./schema/tournaments.schema.js";
import { authSchemas } from "./schema/auth.schema.js";
import { userStatsSchemas } from "./schema/user_stats.schema.js";
import { friendRequestSchemas } from "./schema/friend_request.schema.js";

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

await fastify.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
});
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
await fastify.register(fastifyCookie);
await fastify.register(fastifyRateLimit, {
  max: 1000,
  timeWindow: "15 minutes"
});
await fastify.register(jwt, {
  namespace: "accessToken",
  secret: env.jwtAccessTokenSecret,
  jwtVerify: "accessTokenVerify",
  jwtSign: "accessTokenSign",
  sign: { expiresIn: env.accessTokenTimeToExpireInMs },
  cookie: {
    cookieName: "accessToken",
    signed: false
  }
});
await fastify.register(jwt, {
  namespace: "refreshToken",
  secret: env.jwtRefreshTokenSecret,
  jwtVerify: "refreshTokenVerify",
  jwtSign: "refreshTokenSign",
  sign: { expiresIn: env.refreshTokenTimeToExpireInMS },
  cookie: {
    cookieName: "refreshToken",
    signed: false
  }
});

for (const schema of [
  ...commonSchemas,
  ...userSchemas,
  ...matchSchemas,
  ...tournamentSchemas,
  ...authSchemas,
  ...userStatsSchemas,
  ...friendRequestSchemas
]) {
  fastify.addSchema(schema);
}

await fastify.register(staticRoutes);
await fastify.register(userRoutes, { prefix: "/api/users" });
await fastify.register(matchRoutes, { prefix: "/api/matches" });
await fastify.register(tournamentRoutes, { prefix: "/api/tournaments" });
await fastify.register(authRoutes, { prefix: "/api/auth" });
await fastify.register(userstatsRoutes, { prefix: "/api/user-stats" });
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

export default fastify;
