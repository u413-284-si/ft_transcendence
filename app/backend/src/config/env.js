import path from "node:path";
import envSchema from "env-schema";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schema = {
  type: "object",
  required: [
    "PORT",
    "LOG_LEVEL",
    "NODE_ENV",
    "ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS",
    "REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS",
    "MAX_FILE_SIZE_IN_BYTES",
    "IMAGE_PATH"
  ],
  properties: {
    PORT: {
      type: "number",
      default: 4000
    },
    DOMAIN_NAME: {
      type: "string",
      default: "https://localhost:8443"
    },
    LOG_LEVEL: {
      type: "string",
      default: "info",
      enum: ["info", "warn", "error"]
    },
    NODE_ENV: {
      type: "string",
      default: "development",
      enum: ["development", "production", "testing", "staging"]
    },
    VAULT_ADDR: {
      type: "string",
      default: "https://vault:8200"
    },
    ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "900000"
    },
    REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "86400000"
    },
    TWO_FA_LOGIN_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "60000"
    },
    MAX_FILE_SIZE_IN_BYTES: {
      type: "number",
      default: 5242880, // 5 MB
      description: "Maximum file size in bytes for uploads"
    },
    IMAGE_PATH: {
      type: "string",
      default: "app/frontend/public/images/",
      description: "Path to store uploaded images"
    },
    GOOGLE_OAUTH2_REDIRECT_PATH: {
      type: "string",
      default: "/login/google"
    },
    GOOGLE_OAUTH2_CALLBACK_ROUTE: {
      type: "string",
      default: "/google/callback"
    },
    GOOGLE_OAUTH2_CALLBACK_URL: {
      type: "string",
      default: "https://localhost:8443/api/auth/google/callback"
    },
    STATIC_RATE_LIMIT_MAX: {
      type: "number",
      default: 1000,
      description:
        "Maximum number of requests inside a timeWindow for staticModule"
    },
    STATIC_RATE_LIMIT_TIME_IN_MS: {
      type: "number",
      default: 900000, // 15 min
      description: "Duration of the time window for staticModule"
    },
    API_RATE_LIMIT_MAX: {
      type: "number",
      default: 50,
      description:
        "Maximum number of requests inside a timeWindow for apiModule"
    },
    API_RATE_LIMIT_TIME_IN_MS: {
      type: "number",
      default: 60000, // 1 min
      description: "Duration of the time window for apiModule"
    },
    AUTH_RATE_LIMIT_MAX: {
      type: "number",
      default: 10,
      description:
        "Maximum number of requests inside a timeWindow for auth routes"
    },
    AUTH_RATE_LIMIT_TIME_IN_MS: {
      type: "number",
      default: 60000, // 1 min
      description: "Duration of the time window for auth routes"
    },
    APP_AUTH_DIR: {
      type: "string",
      default: "/vault/secrets/app",
      description: "Location of credentials for vault auth"
    },
    VAULT_CA_CERT_DIR: {
      type: "string",
      default: "/vault/secrets/certs/ca/cert",
      description: "Location of ca-cert of vault"
    },
    USE_VAULT: {
      type: "boolean",
      default: true,
      description: "If secrets are fetched from Vault"
    }
  }
};

const config = envSchema({
  schema: schema,
  dotenv: {
    path: path.join(__dirname, "../../.env")
  }
});

const envConfig = {
  port: config.PORT,
  domainName: config.DOMAIN_NAME,
  logLevel: config.LOG_LEVEL,
  nodeEnv: config.NODE_ENV,
  vaultAddr: config.VAULT_ADDR,
  accessTokenTimeToExpireInMs: config.ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS,
  refreshTokenTimeToExpireInMS: config.REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS,
  twoFALoginTokenTimeToExpireInMS:
    config.TWO_FA_LOGIN_TOKEN_TIME_TO_EXPIRE_IN_MS,
  maxFileSizeInBytes: config.MAX_FILE_SIZE_IN_BYTES,
  imagePath: config.IMAGE_PATH,
  googleOauth2RedirectPath: config.GOOGLE_OAUTH2_REDIRECT_PATH,
  googleOauth2CallbackRoute: config.GOOGLE_OAUTH2_CALLBACK_ROUTE,
  googleOauth2CallbackUrl: config.GOOGLE_OAUTH2_CALLBACK_URL,
  staticRateLimitMax: config.STATIC_RATE_LIMIT_MAX,
  staticRateLimitTimeInMS: config.STATIC_RATE_LIMIT_TIME_IN_MS,
  apiRateLimitMax: config.API_RATE_LIMIT_MAX,
  apiRateLimitTimeInMS: config.API_RATE_LIMIT_TIME_IN_MS,
  authRateLimitMax: config.AUTH_RATE_LIMIT_MAX,
  authRateLimitTimeInMS: config.AUTH_RATE_LIMIT_TIME_IN_MS,
  appAuthDir: config.APP_AUTH_DIR,
  vaultCACertDir: config.VAULT_CA_CERT_DIR,
  useVault: config.USE_VAULT
};

export default envConfig;
