export default async function staticRoutes(fastify) {
	fastify.get("/", (req, reply) => {
		return reply.sendFile("index.html");
	});

	fastify.setNotFoundHandler((req, reply) => {
		if (req.raw.url && req.raw.url.startsWith("/api")) {
			return reply.status(404).send({
				sucess: false,
				error: {
					kind: "user_input",
					message: "Not found"
				}
			});
		}
		return reply.status(200).sendFile("index.html");
	})
}
