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
    ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "900000"
    },
    REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS: {
      type: "string",
      default: "86400000"
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
    GOOGLE_OAUTH2_CALLBACK_URL: {
      type: "string",
      default: "/google/callback"
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
  accessTokenTimeToExpireInMs: config.ACCESS_TOKEN_TIME_TO_EXPIRE_IN_MS,
  refreshTokenTimeToExpireInMS: config.REFRESH_TOKEN_TIME_TO_EXPIRE_IN_MS,
  maxFileSizeInBytes: config.MAX_FILE_SIZE_IN_BYTES,
  imagePath: config.IMAGE_PATH,
  googleOauth2ClientId: config.GOOGLE_OAUTH2_CLIENT_ID,
  googleOauth2ClientSecret: config.GOOGLE_OAUTH2_CLIENT_SECRET,
  googleOauth2CallbackUrl: config.GOOGLE_OAUTH2_CALLBACK_URL
};

export default envConfig;
