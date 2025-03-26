import { getUserStats, getUserStat } from "../controllers/user_stats.controllers.js";

export default async function userStatsRoutes(fastify) {

	fastify.get("/", getUserStats);
	fastify.get("/:id", optionsGetUserStats, getUserStat);

}

const optionsGetUserStats = {
	schema: {
		params: { $ref: "idSchema" },
	}
}
