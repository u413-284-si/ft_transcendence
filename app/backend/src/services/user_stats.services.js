import prisma from "../prisma/prismaClient.js";

const userStatsSelect = {
  userId: true,
  matchesPlayed: true,
  matchesWon: true
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

export async function deleteAllUserStats() {
  const userStats = await prisma.userStats.deleteMany();
  return userStats;
}

function assembleUserStats(userStats) {
  return {
    userId: userStats.userId,
    matchesPlayed: userStats.matchesPlayed,
    matchesWon: userStats.matchesWon,
    matchesLost: userStats.matchesPlayed - userStats.matchesWon,
    winRate:
      userStats.matchesPlayed > 0
        ? (userStats.matchesWon / userStats.matchesPlayed) * 100
        : 0
  };
}
