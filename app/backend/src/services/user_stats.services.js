import prisma from "../prisma/prismaClient.js";

const userStatsSelect = {
  matchesPlayed: true,
  matchesWon: true,
  winstreakCur: true,
  winstreakMax: true
};

export async function updateUserStatsTx(tx, userId, hasWon) {
  const currentStats = await tx.userStats.findUniqueOrThrow({
    where: { userId },
    select: {
      winstreakCur: true,
      winstreakMax: true
    }
  });

  const newWinstreakCur = hasWon ? currentStats.winstreakCur + 1 : 0;
  const newWinstreakMax =
    hasWon && newWinstreakCur > currentStats.winstreakMax
      ? newWinstreakCur
      : currentStats.winstreakMax;

  const stats = await tx.userStats.update({
    where: { userId },
    data: {
      matchesPlayed: { increment: 1 },
      matchesWon: hasWon ? { increment: 1 } : undefined,
      winstreakCur: newWinstreakCur,
      winstreakMax: newWinstreakMax
    },
    select: userStatsSelect
  });

  return stats;
}

export async function getAllUserStats(filter) {
  const whereFilter = filter.username
    ? { user: { username: filter.username } }
    : {};
  const userStats = await prisma.userStats.findMany({
    select: userStatsSelect,
    where: whereFilter,
    take: filter.limit,
    skip: filter.offset
  });
  return userStats.map(assembleUserStats);
}

export async function getUserStats(userId) {
  const userStats = await prisma.userStats.findUniqueOrThrow({
    where: {
      userId
    },
    select: userStatsSelect
  });

  return assembleUserStats(userStats);
}

function assembleUserStats({
  matchesPlayed,
  matchesWon,
  winstreakCur,
  winstreakMax
}) {
  const matchesLost = matchesPlayed - matchesWon;
  const winRate =
    matchesPlayed > 0 ? ((matchesWon / matchesPlayed) * 100).toFixed(2) : 0;

  return {
    matchesPlayed,
    matchesWon,
    matchesLost,
    winRate,
    winstreakCur,
    winstreakMax
  };
}
