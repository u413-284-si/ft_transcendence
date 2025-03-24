export default async function staticRoutes(fastify) {
	fastify.get("/", (req, reply) => {
		reply.sendFile("index.html");
	});
}
