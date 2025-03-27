import { Prisma } from "@prisma/client";
import { getAllUserStats, getUserStats } from "../services/user_stats.services.js";
import { convertPrismaError } from "../prisma/prismaError.js";
import { httpError } from "../utils/error.js";

export async function getAllUserStatsHandler(request, reply) {
	try {
		const userStats = await getAllUserStats();
		const numberOfUserStats = userStats.length;
		return reply.code(200).send({ message: `Found ${numberOfUserStats} user stats`, userStats });
	} catch (err) {
		request.log.error({ err, body: request.body }, "getAllUserStats: Failed to get user stats");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get user stats", cause);
	}
}

export async function getUserStatsHandler(request, reply) {
	try {
		const userId = parseInt(request.params.id, 10);
		const userStats = await getUserStats(userId);
		return reply.code(200).send({message: "Found user stats", userStats});
	} catch (err) {
		request.log.error({ err, body: request.body }, "getUserStatsHandler: Failed to get user stats");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get user stats", cause);
	}
}
