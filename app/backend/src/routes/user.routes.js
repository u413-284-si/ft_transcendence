import { addUser, getUser, getUsers, editUser, deleteUser, getUserMatches } from "../controllers/user.controller.js";

export default async function userRoutes(fastify) {

	fastify.post("/", optionsCreateUser, addUser);

	fastify.get("/:id", optionsGetUser, getUser);

	fastify.get("/", getUsers);

	fastify.put("/:id", optionsUpdateUser, editUser);

	fastify.delete("/:id", optionsGetUser, deleteUser);

	fastify.get("/:id/matches", optionsGetUser, getUserMatches);
}

const optionsCreateUser = {
	schema: {
		body: { $ref: "createUserSchema" },
		response: {
			201: { $ref: "createUserResponseSchema" }
		}
	}
};

const optionsGetUser = {
	schema: {
		params: { $ref: "idSchema" },
	}
}

const optionsUpdateUser = {
	schema: {
		params: { $ref: "idSchema" },
		body: { $ref: "UsernameSchema" }
	}
}
