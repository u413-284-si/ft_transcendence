import { createMatch, getMatches, getMatch } from "../controllers/match.controller.js";

export default async function matchRoutes(fastify) {

	fastify.post("/", optionsCreateMatch, createMatch);

	fastify.get("/", getMatches);

	fastify.get("/:id", optionsGetMatch, getMatch);

}

const optionsCreateMatch = {
	schema: {
		body: { $ref: "createMatchSchema" }
	}
}

const optionsGetMatch = {
	schema: {
		params: { $ref: "idSchema" },
	}
}
