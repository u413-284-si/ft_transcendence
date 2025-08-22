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
  tournamentId,
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
      tournamentId,
      date
    },
    select: matchSelect
  });
  return flattenMatch(match);
}

export async function getAllMatches() {
  const matches = await prisma.match.findMany({ select: matchSelect });
  return matches.map(flattenMatch);
}

export async function getMatch(id) {
  const match = await prisma.match.findUniqueOrThrow({
    where: {
      id
    },
    select: matchSelect
  });
  return flattenMatch(match);
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
  return matches.map(flattenMatch);
}

export async function deleteAllMatches() {
  const matches = await prisma.match.deleteMany();
  return matches;
}

export async function getUserMatchesCount(userId, filter = {}) {
  const total = await prisma.match.count({
    where: {
      userId: userId,
      ...(filter.playedAs ? { playedAs: { in: filter.playedAs } } : {}),
      ...(filter.date ? { date: filter.date } : {})
    }
  });
  return total;
}

function flattenMatch(rawMatch) {
  const { tournament, ...rest } = rawMatch;
  return {
    ...rest,
    tournamentName: tournament ? tournament.name : null
  };
}
