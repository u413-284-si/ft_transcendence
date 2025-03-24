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
