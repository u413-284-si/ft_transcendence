import prisma from "../prisma/prismaClient.js";
import { createMatchTx } from "./matches.services.js";
import { getTournamentTx, updateTournamentTx } from "./tournaments.services.js";
import { updateUserStatsTx } from "./user_stats.services.js";

export async function transactionMatch(
  userId,
  playedAs,
  player1Nickname,
  player2Nickname,
  player1Score,
  player2Score,
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
      tournament,
      date
    );
    if (tournament?.id) {
      const tournamentRecord = await getTournamentTx(tx, tournament.id);
      if (tournamentRecord && tournamentRecord.status === "CREATED") {
        await updateTournamentTx(tx, tournament.id, userId, {
          status: "IN_PROGRESS"
        });
      }
    }

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
