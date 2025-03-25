import prisma from "../prisma/prismaClient.js"

export async function createMatch(request, reply) {
	const {
		playerId,
		playerNickname,
		opponentNickname,
		tournamentId,
		playerScore,
		opponentScore
	} = request.body;
	const won = playerScore > opponentScore ? true : false;

	try {
		const match = await prisma.match.create({
			data: {
				playerId,
				playerNickname,
				opponentNickname,
				tournamentId,
				playerScore,
				opponentScore,
				date: new Date(),
			},
			select: {
				playerNickname: true,
				opponentNickname: true,
				tournamentId: true,
				playerScore: true,
				opponentScore: true
			}
		});
		const stats = await prisma.userStats.update({
			where: { userId: playerId },
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
		return reply.code(201).send({ message: "New match saved", playerId, ...match, ...stats });
	} catch (err) {
		request.log.error(err);
		if (err.code === "P2025")
			reply.code(404).send({ error: "UserStats not found" });
		else
			reply.code(500).send({ error: "Failed to add match" });
	}
}

export async function getMatches(request, reply) {
	try {
		const matches = await prisma.match.findMany({
			select: { id: true }
		});
		if (!matches) {
			return reply.code(404).send({ error: "No matches not found" });
		}
		reply.code(200).send(matches);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to retrieve matches" });
	}
}

export async function getMatch(request, reply) {
	const id = parseInt(request.params.id, 10);

	try {
		const match = await prisma.match.findUnique({
			where: {
				id
			}
		});
		if (!match) {
			return reply.code(404).send({ error: "Match not found" });
		}

		reply.code(200).send(match);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to retrieve Match" });
	}
}

export async function getMatchesByUserId(request, reply) {
	const playerId = parseInt(request.params.id, 10);

	try {
		const matches = await prisma.match.findMany({
			where: {
				playerId
			},
			select: {
				playerNickname: true,
				opponentNickname: true,
				playerScore: true,
				opponentScore: true,
				date: true,
				player: {
					select: {
						username: true
					}
				}
			}
		})
		if (!matches) {
			return reply.code(404).send({ error: "No matches found for this user" });
		}

		reply.code(200).send(matches);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to retrieve matches" });
	}
}
