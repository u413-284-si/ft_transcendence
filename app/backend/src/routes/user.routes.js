import { addUser, getUser, getUsers, editUser, deleteUser } from "../controllers/user.controller.js";

export default async function userRoutes(fastify) {

	fastify.post("/add", addUser);
	fastify.get("/get", getUser);
	fastify.get("/list", getUsers);
	fastify.put("/edit/:id", editUser);
	fastify.delete("/delete/:id", deleteUser);
}
