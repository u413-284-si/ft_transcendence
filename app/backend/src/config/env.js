import path from "node:path";
import envSchema from "env-schema";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schema = {
  type: "object",
  required: ["PORT", "LOG_LEVEL", "NODE_ENV", "DB_FILE"],
  properties: {
	NODE_ENV: {
	  type: "string",
	  default: "development",
	  enum: ["development", "production", "testing", "staging"],
	},
	PORT: {
	  type: "number",
	  default: 4000,
	},
	LOG_LEVEL: {
		type: "string",
		default: "info",
		enum: ["info", "warn", "error"],
	},
	DB_FILE: {
		type: "string",
		default: "pong.db",
	},
  },
};

const config= envSchema({
	schema: schema,
	dotenv: {
    path: path.join(__dirname, "../../.env"),
  },
});

const envConfig = {
	port: config.PORT,
	logLevel: config.LOG_LEVEL,
	nodeEnv: config.NODE_ENV,
	dbFile: config.DB_FILE,
};

export default envConfig;
