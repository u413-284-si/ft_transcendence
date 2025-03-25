import prisma from "./prismaClient.js"

// Middleware to automatically update win_rate
export const updateWinRateMiddleware = async (params, next) => {
	if (params.model === 'UserStats' && params.action === 'update') {
		const data = params.args.data;

		// Check if matchesWon or matchesPlayed is updated
		if (data.matchesWon !== undefined || data.matchesPlayed !== undefined) {
			const userStats = await prisma.userStats.findUnique({
				where: { userId: params.args.where.userId },
				select: { matchesWon: true, matchesPlayed: true },
			});

			if (userStats) {
				const matchesWon = userStats.matchesWon;
				const matchesPlayed = userStats.matchesPlayed;

				const newWinRate = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0;

				params.args.data.winRate = newWinRate;
			}
		}
	}

	return next(params);
};
