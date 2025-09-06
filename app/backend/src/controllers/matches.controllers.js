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
