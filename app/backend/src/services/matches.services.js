import prisma from "../prisma/prismaClient.js";

export async function createMatch(
  playerId,
  playerNickname,
  opponentNickname,
  tournamentId,
  playerScore,
  opponentScore
) {
  const match = await prisma.match.create({
    data: {
      playerId,
      playerNickname,
      opponentNickname,
      tournamentId,
      playerScore,
      opponentScore,
      date: new Date()
    },
    select: {
      playerNickname: true,
      opponentNickname: true,
      tournamentId: true,
      playerScore: true,
      opponentScore: true
    }
  });
  return match;
}

export async function getAllMatches() {
  const matches = await prisma.match.findMany();
  return matches;
}

export async function getMatch(id) {
  const match = await prisma.match.findUniqueOrThrow({
    where: {
      id
    }
  });
  return match;
}
