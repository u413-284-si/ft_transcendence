import Fastify from "fastify";
import FastifyOverview from "fastify-overview";
import fastifyOverviewUi from "fastify-overview-ui";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import fastifyCookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import oAuth2 from "@fastify/oauth2";

import env from "./config/env.js";

import staticModule from "./modules/static.module.js";
import apiModule from "./modules/api.module.js";

import { commonSchemas } from "./schema/common.schema.js";
import { userSchemas } from "./schema/users.schema.js";
import { matchSchemas } from "./schema/matches.schema.js";
import { tournamentSchemas } from "./schema/tournaments.schema.js";
import { authSchemas } from "./schema/auth.schema.js";
import { userStatsSchemas } from "./schema/user_stats.schema.js";
import { friendRequestSchemas } from "./schema/friend_request.schema.js";

const fastify = Fastify({
  exposeHeadRoutes: false,
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

await fastify.register(FastifyOverview, { addSource: true, hideEmpty: true });
await fastify.register(fastifyOverviewUi);

await fastify.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
});
await fastify.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "http://localhost:4000",
        "https://accounts.google.com"
      ]
    }
  }
});
await fastify.register(fastifyCompress);
await fastify.register(fastifyGracefulShutdown);
await fastify.register(fastifyFormbody);
await fastify.register(fastifyCookie);
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
await fastify.register(jwt, {
  namespace: "twoFaTempToken",
  secret: env.jwtTwoFaTempTokenSecret,
  jwtVerify: "twoFaTempTokenVerify",
  jwtSign: "twoFaTempTokenSign",
  sign: { expiresIn: env.twoFaTempTokenTimeToExpireInMS },
  cookie: {
    cookieName: "twoFaTempToken",
    signed: false
  }
});
await fastify.register(fastifyMultipart, {
  limits: {
    fileSize: env.maxFileSizeInBytes
  }
});

await fastify.register(oAuth2, {
  name: "googleOauth2",
  scope: ["email", "profile"],
  credentials: {
    client: {
      id: env.googleOauth2ClientId,
      secret: env.googleOauth2ClientSecret
    }
  },
  startRedirectPath: env.googleOauth2RedirectPath,
  callbackUri: env.googleOauth2CallbackUrl,
  callbackUriParams: {
    prompt: "select_account"
  },
  discovery: {
    issuer: "https://accounts.google.com/.well-known/openid-configuration"
  },
  cookie: {
    httpOnly: true,
    secure: true,
    path: "/"
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

await fastify.register(staticModule);
await fastify.register(apiModule, { prefix: "/api" });

fastify.listen({ host: "0.0.0.0", port: env.port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Pong game is running in ${env.nodeEnv} mode at ${address}`);
});

export default fastify;
