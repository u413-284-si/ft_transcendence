import {
  createMatch,
  getAllMatches,
  getMatch
} from "../services/matches.services.js";
import { updateUserStats } from "../services/user_stats.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";

export async function createMatchHandler(request, reply) {
  const action = "Create match";
  try {
    const {
      playerId,
      playerNickname,
      opponentNickname,
      tournamentId,
      playerScore,
      opponentScore
    } = request.body;
    const hasWon = playerScore > opponentScore ? true : false;

    const match = await createMatch(
      playerId,
      playerNickname,
      opponentNickname,
      tournamentId,
      playerScore,
      opponentScore
    );
    const stats = await updateUserStats(playerId, hasWon);
    const data = { match, stats };
    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createMatchHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getAllMatchesHandler(request, reply) {
  const action = "Get all matches";
  try {
    const data = await getAllMatches();
    const count = data.length;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), count, data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getAllMatchesHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getMatchHandler(request, reply) {
  const action = "Get match";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await getMatch(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getMatchHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
