import { getRoot } from "../controllers/root.controller.js";
import { addUser, getUsers , editUser} from "../controllers/user.controller.js";

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);

	fastify.register(
		async function (userRoutes) {
			userRoutes.post("/add", addUser);
			userRoutes.get("/list", getUsers);
			userRoutes.put("/edit/:id", editUser);
		},
		{ prefix: "/user" }
	);
}
