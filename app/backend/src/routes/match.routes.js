import { createMatch, getMatches, getMatch, getMatchesByUserId } from "../controllers/match.controller.js";

export default async function matchRoutes(fastify) {

	fastify.post("/", optionsCreateMatch, createMatch);

	fastify.get("/", getMatches);

	fastify.get("/:id", optionsGetMatch, getMatch);

	fastify.get("/user/:id", optionsGetMatch, getMatchesByUserId);

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
