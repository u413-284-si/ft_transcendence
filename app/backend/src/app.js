import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import fastifyStatic from "@fastify/static";

import env from "./config/env.js";
import logger from "./config/logger.js";

import userRoutes from "./routes/user.routes.js";
import staticRoutes from "./routes/static.routes.js"
import matchRoutes from "./routes/match.routes.js"

import { commonSchemas } from "./schema/common.schema.js";
import { userSchemas } from "./schema/user.schema.js"
import { matchSchemas } from "./schema/match.schema.js"


const fastify = Fastify({
	logger: {
		level: "info",
		transport: {
			target: "pino-pretty",
		}
	}
});

await fastify.register(fastifyCors);
await fastify.register(fastifyHelmet);
await fastify.register(fastifyCompress);
await fastify.register(fastifyGracefulShutdown);
await fastify.register(fastifyFormbody);

for (const schema of [
	...commonSchemas,
	...userSchemas,
	...matchSchemas]) {
	fastify.addSchema(schema);
}

await fastify.register(staticRoutes);
await fastify.register(userRoutes, { prefix: "/api/user" });
await fastify.register(matchRoutes, { prefix: "/api/match" });
await fastify.register(fastifyStatic, {
	root: "/app/frontend/public",
});

fastify.listen({ host: '0.0.0.0', port: env.port }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`Pong game is running in ${env.nodeEnv} mode at ${address}`);
});
