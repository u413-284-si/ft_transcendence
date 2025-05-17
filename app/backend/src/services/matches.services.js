import prisma from "../prisma/prismaClient.js";

const matchSelect = {
  player1Id: true,
  player2Id: true,
  player1Nickname: true,
  player2Nickname: true,
  tournamentId: true,
  player1Score: true,
  player2Score: true,
  date: true
};

export async function createMatch(
  player1Id,
  player2Id,
  player1Nickname,
  player2Nickname,
  tournamentId,
  player1Score,
  player2Score
) {
  const match = await prisma.match.create({
    data: {
      player1Id,
      player2Id,
      player1Nickname,
      player2Nickname,
      tournamentId,
      player1Score,
      player2Score,
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
      OR: [{ player1Id: id }, { player2Id: id }]
    },
    select: matchSelect
  });
  return matches;
}

export async function deleteAllMatches() {
  const matches = await prisma.match.deleteMany();
  return matches;
}
