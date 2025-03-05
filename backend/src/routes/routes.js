import { getRoot } from "../controllers/root.controller.js";
import { addUser, getUsers , editUser, deleteUser} from "../controllers/user.controller.js";
import errorHandler from "../middleware/error.js";

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);

	fastify.register(
		async function (userRoutes) {
			userRoutes.post("/add", addUser);
			userRoutes.get("/list", getUsers);
			userRoutes.put("/edit/:id", editUser);
			userRoutes.delete("/delete/:id", deleteUser);
		},
		{ prefix: "/user" }
	);
	
	fastify.setErrorHandler(errorHandler);
}
