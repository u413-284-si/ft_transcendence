import prisma from "../prisma/prismaClient.js";

export async function getBracketMatch(tournamentId, matchNumber) {
  const bracketMatch = await prisma.bracketMatch.findUniqueOrThrow({
    where: {
      tournamentId_matchNumber: {
        tournamentId,
        matchNumber
      }
    }
  });
  return bracketMatch;
}

export async function updateBracketMatchTx(
  tx,
  tournamentId,
  matchNumber,
  updateData
) {
  const bracketMatch = await tx.bracketMatch.update({
    where: {
      tournamentId_matchNumber: {
        tournamentId,
        matchNumber
      }
    },
    data: updateData
  });
  return bracketMatch;
}

export async function createBracketTx(tx, tournamentId, bracket) {
  const bracketData = bracket.map((b) => ({
    tournamentId: tournamentId,
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
}
