import {
  createMatch,
  getAllMatches,
  getMatch,
  deleteAllMatches
} from "../services/matches.services.js";
import { updateUserStats } from "../services/user_stats.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";

export async function createMatchHandler(request, reply) {
  const action = "Create match";
  try {
    const {
      player1Id,
      player2Id,
      player1Nickname,
      player2Nickname,
      tournamentId,
      player1Score,
      player2Score
    } = request.body;

    const match = await createMatch(
      player1Id,
      player2Id,
      player1Nickname,
      player2Nickname,
      tournamentId,
      player1Score,
      player2Score
    );
    let stats = null;
    if (player1Id !== null) {
      await updateUserStats(
        player1Id,
        player1Score > player2Score ? true : false
      );
    } else if (player2Id !== null) {
      await updateUserStats(
        player2Id,
        player2Score > player1Score ? true : false
      );
    }
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
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
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
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getMatchHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function deleteAllMatchesHandler(request, reply) {
  const action = "Delete all matches";
  try {
    const data = await deleteAllMatches();
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteAllMatchesHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}
