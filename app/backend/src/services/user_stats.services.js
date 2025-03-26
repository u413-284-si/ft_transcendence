import prisma from "../prisma/prismaClient.js";

export async function updateUserStats(userId, won) {
	const stats = await prisma.userStats.update({
		where: { userId },
		data: {
			matchesPlayed: { increment: 1 },
			matchesWon: { increment: won ? 1 : 0 },
			matchesLost: { increment: won ? 0 : 1 }
		},
		select: {
			matchesPlayed: true,
			matchesWon: true,
			matchesLost: true,
			winRate: true
		}
	});
	return stats;
}
