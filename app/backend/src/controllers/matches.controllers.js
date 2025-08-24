import {
  getAllMatches,
  getMatch,
  deleteAllMatches
} from "../services/matches.services.js";
import { createResponseMessage } from "../utils/response.js";
import { handlePrismaError } from "../utils/error.js";
import { transactionMatch } from "../services/transactions.services.js";

export async function createMatchHandler(request, reply) {
  const action = "Create match";
  try {
    const userId = request.user.id;
    const {
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Type,
      player2Type,
      player1Score,
      player2Score
    } = request.body;
    const date = new Date();

    const data = await transactionMatch(
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      player1Type,
      player2Type,
      date
    );

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
    const matchId = request.params.id;
    const data = await getMatch(matchId);
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
