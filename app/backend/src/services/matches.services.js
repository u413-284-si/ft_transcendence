import prisma from "../prisma/prismaClient.js";

const matchSelect = {
  playedAs: true,
  player1Nickname: true,
  player2Nickname: true,
  player1Score: true,
  player2Score: true,
  player1Type: true,
  player2Type: true,
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
  player1Type,
  player2Type,
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
      player1Type,
      player2Type,
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

export async function getUserMatches(
  userId,
  select = matchSelect,
  filter = {}
) {
  const matches = await prisma.match.findMany({
    where: {
      userId: userId,
      ...(filter.playedAs ? { playedAs: { in: filter.playedAs } } : {}),
      ...(filter.date ? { date: filter.date } : {})
    },
    select: select,
    take: filter.limit,
    skip: filter.offset,
    orderBy: { date: filter.sort || "desc" }
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
