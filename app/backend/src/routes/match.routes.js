import { createMatch } from "../controllers/match.controller.js";

export default async function matchRoutes(fastify) {

	fastify.post("/",
		{
			schema: {
				body: { $ref: "createMatchSchema" }
			}
		},
		createMatch);

}
