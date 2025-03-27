import { Prisma } from "@prisma/client";
import { createMatch, getAllMatches, getMatch } from "../services/matches.services.js";
import { updateUserStats } from "../services/user_stats.services.js";
import { convertPrismaError } from "../prisma/prismaError.js";
import { httpError } from "../utils/error.js";

export async function createMatchHandler(request, reply) {
	try {
		const {
			playerId,
			playerNickname,
			opponentNickname,
			tournamentId,
			playerScore,
			opponentScore
		} = request.body;
		const won = playerScore > opponentScore ? true : false;

		const match = await createMatch(playerId, playerNickname, opponentNickname, tournamentId, playerScore, opponentScore);
		const stats = await updateUserStats(playerId, won);
		return reply.code(201).send({ message: "New match created", match, stats });
	} catch (err) {
		request.log.error({ err, body: request.body }, "createMatchHandler: Failed to create match");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to create match", cause);
	}
}

export async function getAllMatchesHandler(request, reply) {
	try {
		const matches = await getAllMatches();
		const numberOfMatches = matches.length;
		return reply.code(200).send({ message: `Found ${numberOfMatches} matches`, matches });
	} catch (err) {
		request.log.error({ err, body: request.body }, "getAllMatchesHandler: Failed to get matches");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get matches", cause);
	}
}

export async function getMatchHandler(request, reply) {
	try {
		const id = parseInt(request.params.id, 10);
		const match = await getMatch(id);
		return reply.code(200).send({ message: "Found match", match });
	} catch (err) {
		request.log.error({ err, body: request.body }, "getMatchHandler: Failed to get match");
		let code = 500;
		let cause = "Internal Server Error";
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			code = convertPrismaError(err.code);
			cause = err.meta.cause;
		}
		return httpError(reply, code, "Failed to get match", cause);
	}
}
