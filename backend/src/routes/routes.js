import { getRoot } from "../controllers/root.controller.js";
import { addUser } from "../controllers/user.controller.js";

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);

	fastify.register(
		async function (postRoutes) {
			postRoutes.post("/users", addUser);
		},
		{ prefix: "/post" }
	);
}
