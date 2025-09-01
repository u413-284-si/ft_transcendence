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
import fs from "fs";
import Vault from "hashi-vault-js";

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
import { dashboardSchemas } from "./schema/dashboard.schema.js";

async function getSecrets(roleId, secretId) {
  const status = await vault.healthCheck();
  if (status.sealed) throw new Error("Vault is sealed");

  const loginResponse = await vault.loginWithAppRole(
    roleId,
    secretId,
    "auth/approle"
  );

  const jwtSecrets = await vault.readKVSecret(
    loginResponse.client_token,
    "jwt"
  );
  const googleSecret = await vault.readKVSecret(
    loginResponse.client_token,
    "google"
  );

  return { jwtSecrets, googleSecret };
}

const vault = new Vault({
  https: false,
  baseUrl: `${env.vaultAddr}/v1`,
  rootPath: "secret",
  timeout: 1000,
  proxy: false
});
const roleId = fs.readFileSync("/app/secrets/app_role_id", "utf8").trim();
const secretId = fs.readFileSync("/app/secrets/app_secret_id", "utf8").trim();

let secrets;
try {
  secrets = await getSecrets(roleId, secretId);
} catch (err) {
  console.error("❌ Failed to initialize Vault:", err);
  process.exit(1);
}

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
  secret: secrets.jwtSecrets.data.access_token_secret,
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
  secret: secrets.jwtSecrets.data.refresh_token_secret,
  jwtVerify: "refreshTokenVerify",
  jwtSign: "refreshTokenSign",
  sign: { expiresIn: env.refreshTokenTimeToExpireInMS },
  cookie: {
    cookieName: "refreshToken",
    signed: false
  }
});
await fastify.register(jwt, {
  namespace: "twoFALoginToken",
  secret: secrets.jwtSecrets.data.two_fa_login_token_secret,
  jwtVerify: "twoFALoginTokenVerify",
  jwtSign: "twoFALoginTokenSign",
  sign: { expiresIn: env.twoFALoginTokenTimeToExpireInMS },
  cookie: {
    cookieName: "twoFALoginToken",
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
      secret: secrets.googleSecret.data.google_oauth2_client_secret
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
  ...friendRequestSchemas,
  ...dashboardSchemas
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
