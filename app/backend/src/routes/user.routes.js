import { addUser, getUser, getUsers, editUser, deleteUser } from "../controllers/user.controller.js";

export default async function userRoutes(fastify) {



	fastify.post(
		"/add",
		{
			schema: {
				body: { $ref: "createUserSchema" },
				response: {
					201: { $ref: "createUserResponseSchema" }
				}
			}
		},
		addUser);
	fastify.get(
		"/get",
		{
			schema: {
				querystring: { $ref: "getUserByUsernameSchema" }
			}
		},
		getUser);
	fastify.get("/list", getUsers);
	fastify.put(
		"/edit/:id",
		{
			schema: {
				params: { $ref: "idSchema" },
				body: { $ref: "getUserByUsernameSchema" }
			}
		},
		editUser);
	fastify.delete(
		"/delete/:id",
		{
			schema: {
				params: { $ref: "idSchema" },
			}
		},
		deleteUser);
}
