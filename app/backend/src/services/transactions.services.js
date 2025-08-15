import prisma from "../prisma/prismaClient.js";
import { createMatchTx } from "./matches.services.js";
import { updateUserStatsTx } from "./user_stats.services.js";

export async function transactionMatch(
  userId,
  playedAs,
  player1Nickname,
  player2Nickname,
  player1Score,
  player2Score,
  player1Type,
  player2Type,
  tournament,
  date
) {
  return prisma.$transaction(async (tx) => {
    const match = await createMatchTx(
      tx,
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      player1Type,
      player2Type,
      tournament,
      date
    );

    let stats = null;
    if (playedAs !== "NONE") {
      const isPlayerOne = playedAs === "PLAYERONE";
      stats = await updateUserStatsTx(
        tx,
        userId,
        (isPlayerOne ? player1Score : player2Score) >
          (isPlayerOne ? player2Score : player1Score)
      );
    }
    return { match, stats };
  });
}
