import prisma from "../prisma/prismaClient.js";

export async function getUserStats(request, reply) {
	try {
		const userStats = await prisma.userStats.findMany();
		if (!userStats) {
			return reply.code(404).send({ error: "No user stats found" });
		}
		return reply.code(200).send(userStats);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Failed to retrieve user stats" });
	}
}

export async function getUserStat(request, reply) {
	const userId = parseInt(request.params.id, 10);
	try {
		const userStat = await prisma.userStats.findUnique({
			where: {
				userId
			}
		})
		if (!userStat) {
			return reply.code(404).send({ error: "User stat not found" });
		}
		return reply.code(200).send(userStat);
	} catch (err) {
		request.log.error(err);
		return reply.code(500).send({ error: "Failed to retrieve user" });
	}
}
