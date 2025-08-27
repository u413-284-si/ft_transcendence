import {
  getAllMatches,
  getMatch,
  deleteAllMatches
} from "../services/matches.services.js";
import { createResponseMessage } from "../utils/response.js";
import { transactionMatch } from "../services/transactions.services.js";

export async function createMatchHandler(request, reply) {
  request.action = "Create match";

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
    .send({ message: createResponseMessage(request.action, true), data });
}

export async function getAllMatchesHandler(request, reply) {
  request.action = "Get all matches";
  const data = await getAllMatches();
  const count = data.length;
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    count: count,
    data: data
  });
}

export async function getMatchHandler(request, reply) {
  request.action = "Get match";
  const matchId = request.params.id;
  const data = await getMatch(matchId);
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function deleteAllMatchesHandler(request, reply) {
  request.action = "Delete all matches";
  const data = await deleteAllMatches();
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}
