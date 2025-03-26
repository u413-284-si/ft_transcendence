import { getAllUserStatsHandler, getUserStatsHandler } from "../controllers/user_stats.controllers.js";

export default async function userStatsRoutes(fastify) {

	fastify.get("/", getAllUserStatsHandler);
	fastify.get("/:id", optionsGetUserStats, getUserStatsHandler);

}

const optionsGetUserStats = {
	schema: {
		params: { $ref: "idSchema" },
	}
}
