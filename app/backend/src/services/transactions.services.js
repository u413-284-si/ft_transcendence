import prisma from "../prisma/prismaClient.js";
import { createMatchTx } from "./matches.services.js";
import { generateBracket } from "./tournaments.services.js";
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

export async function transactionTournament(
  name,
  maxPlayers,
  userId,
  userNickname,
  nicknames,
  playertypes
) {
  return prisma.$transaction(async (tx) => {
    const tournament = await tx.tournament.create({
      data: {
        name,
        maxPlayers,
        userId,
        userNickname
      }
    });

    const bracket = generateBracket(nicknames, playertypes, maxPlayers);

    const bracketData = bracket.map((b) => ({
      tournamentId: tournament.id,
      matchNumber: b.matchNumber,
      round: b.round,
      player1Nickname: b.player1Nickname,
      player2Nickname: b.player2Nickname,
      player1Type: b.player1Type,
      player2Type: b.player2Type,
      winner: null,
      nextMatchNumber: b.nextMatchNumber,
      winnerSlot: b.winnerSlot
    }));

    await tx.bracketMatch.createMany({
      data: bracketData
    });

    tournament.bracket = bracket;

    return tournament;
  });
}
