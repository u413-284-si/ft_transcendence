import { registerUserHandler, getUserHandler, getAllUsersHandler, updateUserHandler, deleteUserHandler, getUserMatchesHandler } from "../controllers/users.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function userRoutes(fastify) {

	fastify.post("/", optionsCreateUser, registerUserHandler);

	fastify.get("/:id", optionsGetUser, getUserHandler);

	fastify.get("/", getAllUsersHandler);

	fastify.put("/:id", optionsUpdateUser, updateUserHandler);

	fastify.delete("/:id", optionsGetUser, deleteUserHandler);

	fastify.get("/:id/matches", optionsGetUser, getUserMatchesHandler);
}

const optionsCreateUser = {
	schema: {
		body: { $ref: "createUserSchema" },
		response: {
			201: { $ref: "createUserResponseSchema" },
			...errorResponses
		}
	}
};

const optionsGetUser = {
	schema: {
		params: { $ref: "idSchema" },
		response: {
			...errorResponses
		}
	}
}

const optionsUpdateUser = {
	schema: {
		params: { $ref: "idSchema" },
		body: { $ref: "updateUserSchema" },
		response: {
			...errorResponses
		}
	}
}
