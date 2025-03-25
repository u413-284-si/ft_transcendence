import prisma from "../prisma/prismaClient.js";

export async function getUserStats(request, reply) {
	try {
		const userStats = await prisma.userStats.findMany();
		if (!userStats) {
			return reply.code(404).send({ error: "No user stats found" });
		}
		reply.code(200).send(userStats);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to retrieve user stats" });
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
		reply.code(200).send(userStat);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to retrieve user" });
	}
}

export async function updateUserStats(request, reply) {
	const userId = parseInt(request.params.id, 10);
	const { matchWon } = request.body;

	try {
		const stats = await prisma.userStats.update({
			where: { userId },
			data: {
				matchesPlayed: { increment: 1 },
				matchesWon: { increment: matchWon ? 1 : 0 },
				matchesLost: { increment: matchWon ? 0 : 1 }
			}
		})
		reply.code(200).send({ message: "Stats updated", ...stats });
	} catch (err) {
		request.log.error(err);
		if (err.code === "P2025")
			reply.code(404).send({ error: "UserStats not found" });
		else
			reply.code(500).send({ error: "Failed to retrieve Match" });
	}
}
