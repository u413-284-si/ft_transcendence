import { addUser, getUser, getUsers, editUser, deleteUser } from "../controllers/user.controller.js";
import errorHandler from "../middleware/error.js";

export async function staticRoutes(fastify) {
	fastify.get("/", (req, reply) => {
		reply.sendFile("index.html");
	});
}

export async function routes(fastify, options) {

	fastify.register(
		async function (userRoutes) {
			userRoutes.post("/add", addUser);
			userRoutes.get("/get", getUser);
			userRoutes.get("/list", getUsers);
			userRoutes.put("/edit/:id", editUser);
			userRoutes.delete("/delete/:id", deleteUser);
		},
		{ prefix: "/user" }
	);

	fastify.setErrorHandler(errorHandler);
}
