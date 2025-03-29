import { getAllUserStats, getUserStats } from "../services/user_stats.services.js";
import { createResponseMessage } from "../utils/response.js"
import { handlePrismaError } from "../utils/error.js";

export async function getAllUserStatsHandler(request, reply) {
	const action = "Get all user stats"
	try {
		const userStats = await getAllUserStats();
		const numberOfUserStats = userStats.length;
		return reply.code(200).send({ message: createResponseMessage(action, true), count: numberOfUserStats, userStats });
	} catch (err) {
		request.log.error({ err, body: request.body }, `getAllUserStats: ${createResponseMessage(action, false)}`);
		handlePrismaError(reply, action, err);
	}
}

export async function getUserStatsHandler(request, reply) {
	const action = "Get user stats"
	try {
		const userId = parseInt(request.params.id, 10);
		const userStats = await getUserStats(userId);
		return reply.code(200).send({ message: createResponseMessage(action, true), userStats });
	} catch (err) {
		request.log.error({ err, body: request.body }, `getUserStatsHandler: ${createResponseMessage(action, false)}`);
		handlePrismaError(reply, action, err);
	}
}
