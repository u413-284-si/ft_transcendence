import prisma from "../prisma/prismaClient.js";

const matchSelect = {
  playerNickname: true,
  opponentNickname: true,
  tournamentId: true,
  playerScore: true,
  opponentScore: true,
  date: true
};

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
    select: matchSelect
  });
  if (tournamentId) {
    const tournament = await prisma.tournament.findUniqueOrThrow({
      where: { id: tournamentId }
    });

    if (tournament && tournament.status === "CREATED") {
      await prisma.tournament.update({
        where: { id: tournament.id },
        data: { status: "IN_PROGRESS" }
      });
    }
  }
  return match;
}

export async function getAllMatches() {
  const matches = await prisma.match.findMany({ select: matchSelect });
  return matches;
}

export async function getMatch(id) {
  const match = await prisma.match.findUniqueOrThrow({
    where: {
      id
    },
    select: matchSelect
  });
  return match;
}

export async function getUserMatches(id) {
  const matches = await prisma.match.findMany({
    where: {
      playerId: id
    },
    select: matchSelect
  });
  return matches;
}
