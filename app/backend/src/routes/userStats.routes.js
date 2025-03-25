import { updateUserStats } from "../controllers/userStats.controller.js";

export default async function userStatsRoutes(fastify) {

	fastify.put("/:id", optionsUpdateUserStats, updateUserStats);

}

const optionsUpdateUserStats = {
	schema: {
		params: { $ref: "idSchema" },
		body: { $ref: "updateUserStatsSchema" }
	}
}
