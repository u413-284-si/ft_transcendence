import prisma from "../prisma/prismaClient.js";

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
