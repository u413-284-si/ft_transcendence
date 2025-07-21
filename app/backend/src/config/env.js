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
    "DB_FILE",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_SECRET",
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
    DB_FILE: {
      type: "string",
      default: "pong.db"
    },
    JWT_ACCESS_TOKEN_SECRET: {
      type: "string",
      default: "access_secret"
    },
    JWT_REFRESH_TOKEN_SECRET: {
      type: "string",
      default: "refresh_secret"
    },
    JWT_TWO_FA_TEMP_TOKEN_SECRET: {
      type: "string",
      default: "two_fa_temp_secret"
    },
    ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "900000"
    },
    REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "86400000"
    },
    TWO_FA_TEMP_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "180000"
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
    GOOGLE_OAUTH2_CLIENT_ID: {
      type: "string",
      default: "client_id"
    },
    GOOGLE_OAUTH2_CLIENT_SECRET: {
      type: "string",
      default: "client_secret"
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
      default: "http://localhost:4000/api/auth/google/callback"
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
      default: 20,
      description:
        "Maximum number of requests inside a timeWindow for auth routes"
    },
    AUTH_RATE_LIMIT_TIME_IN_MS: {
      type: "number",
      default: 60000, // 1 min
      description: "Duration of the time window for auth routes"
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
  logLevel: config.LOG_LEVEL,
  nodeEnv: config.NODE_ENV,
  dbFile: config.DB_FILE,
  jwtAccessTokenSecret: config.JWT_ACCESS_TOKEN_SECRET,
  jwtRefreshTokenSecret: config.JWT_REFRESH_TOKEN_SECRET,
  jwTwoFaLoginTokenSecret: config.JWT_TWO_FA_TEMP_TOKEN_SECRET,
  accessTokenTimeToExpireInMs: config.ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS,
  refreshTokenTimeToExpireInMS: config.REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS,
  twoFaLoginTokenTimeToExpireInMS:
    config.TWO_FA_TEMP_TOKEN_TIME_TO_EXPIRE_IN_MS,
  maxFileSizeInBytes: config.MAX_FILE_SIZE_IN_BYTES,
  imagePath: config.IMAGE_PATH,
  googleOauth2ClientId: config.GOOGLE_OAUTH2_CLIENT_ID,
  googleOauth2ClientSecret: config.GOOGLE_OAUTH2_CLIENT_SECRET,
  googleOauth2RedirectPath: config.GOOGLE_OAUTH2_REDIRECT_PATH,
  googleOauth2CallbackRoute: config.GOOGLE_OAUTH2_CALLBACK_ROUTE,
  googleOauth2CallbackUrl: config.GOOGLE_OAUTH2_CALLBACK_URL,
  staticRateLimitMax: config.STATIC_RATE_LIMIT_MAX,
  staticRateLimitTimeInMS: config.STATIC_RATE_LIMIT_TIME_IN_MS,
  apiRateLimitMax: config.API_RATE_LIMIT_MAX,
  apiRateLimitTimeInMS: config.API_RATE_LIMIT_TIME_IN_MS,
  authRateLimitMax: config.AUTH_RATE_LIMIT_MAX,
  authRateLimitTimeInMS: config.AUTH_RATE_LIMIT_TIME_IN_MS
};

export default envConfig;
