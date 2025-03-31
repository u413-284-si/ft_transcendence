export default async function staticRoutes(fastify) {
	fastify.get("/", (req, reply) => {
		return reply.sendFile("index.html");
	});

	fastify.setNotFoundHandler((req, reply) => {
		if (req.raw.url && req.raw.url.startsWith("/api")) {
			return reply.status(404).send({
				message: `Fail: ${req.raw.url}`,
				cause: "Route does not exist"
			});
		}
		return reply.status(200).sendFile("index.html");
	})
}
