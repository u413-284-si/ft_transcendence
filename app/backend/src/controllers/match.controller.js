import prisma from "../utils/prisma.js"

export async function createMatch(request, reply) {
	const {
		playerId,
		playerNickname,
		opponentNickname,
		tournamentId,
		playerScore,
		opponentScore
	} = request.body;

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
			select: { id: true }
		})

		return reply.code(201).send(match);
	} catch (err) {
		request.log.error(err);
		reply.code(500).send({ error: "Failed to add match" });
	}
}

export async function getMatches(request, reply) {
	try {
		const matches = await prisma.match.findMany({
			select: { id: true }
		}
		);

		// Respond with the list of matches
		reply.code(200).send(matches);
	} catch (err) {
		// Log the error and respond with a 500 status code
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
		})
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