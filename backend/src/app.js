import Fastify from "fastify";
import env from "./config/env.js";
import logger from "./config/logger.js";
import routes from "./routes/routes.js";
import dbConnector from "./config/db.js";
import fastifyFormbody from "@fastify/formbody";


const fastify = Fastify({
  logger: {
		level: "info",
		transport: {
			target: "pino-pretty",
		}
	}
});

fastify.register(dbConnector);
await fastify.register(fastifyFormbody);
await fastify.register(routes);

fastify.listen({ port: env.port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
 }
  fastify.log.info(`Pong game is running in ${env.nodeEnv} mode at ${address}`);
});
