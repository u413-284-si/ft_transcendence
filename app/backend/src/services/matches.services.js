import prisma from "../prisma/prismaClient.js";

const matchSelect = {
  playedAs: true,
  player1Nickname: true,
  player2Nickname: true,
  player1Score: true,
  player2Score: true,
  date: true,
  tournament: {
    select: {
      id: true,
      name: true
    }
  }
};

export async function createMatchTx(
  tx,
  userId,
  playedAs,
  player1Nickname,
  player2Nickname,
  player1Score,
  player2Score,
  tournament,
  date
) {
  const match = await tx.match.create({
    data: {
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      tournamentId: tournament?.id || null,
      date: date
    },
    select: matchSelect
  });
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

export async function getUserMatches(userId, playedAs) {
  const matches = await prisma.match.findMany({
    where: {
      userId: userId,
      ...(playedAs ? { playedAs: { in: playedAs } } : {})
    },
    select: matchSelect
  });
  return matches;
}

export async function getUserMatchesByUsername(username, playedAs) {
  const matches = await prisma.match.findMany({
    where: {
      user: { username: username },
      ...(playedAs ? { playedAs: { in: playedAs } } : {})
    },
    select: matchSelect
  });
  return matches;
}

export async function deleteAllMatches() {
  const matches = await prisma.match.deleteMany();
  return matches;
}
