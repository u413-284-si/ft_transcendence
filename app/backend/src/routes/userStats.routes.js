import { getUserStats, getUserStat, updateUserStats } from "../controllers/userStats.controller.js";

export default async function userStatsRoutes(fastify) {

	fastify.get("/", getUserStats);
	fastify.get("/:id", optionsGetUserStats, getUserStat);
	fastify.put("/:id", optionsUpdateUserStats, updateUserStats);

}

const optionsGetUserStats = {
	schema: {
		params: { $ref: "idSchema" },
	}
}

const optionsUpdateUserStats = {
	schema: {
		params: { $ref: "idSchema" },
		body: { $ref: "updateUserStatsSchema" }
	}
}
