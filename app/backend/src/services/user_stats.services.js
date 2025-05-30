import prisma from "../prisma/prismaClient.js";

const userStatsSelect = {
  userId: true,
  matchesPlayed: true,
  matchesWon: true
};

export async function updateUserStats(userId, hasWon) {
  const userStats = await prisma.userStats.findUnique({
    where: { userId },
    select: { matchesPlayed: true, matchesWon: true }
  });

  const matchesPlayed = userStats.matchesPlayed + 1;
  const matchesWon = userStats.matchesWon + (hasWon ? 1 : 0);

  const stats = await prisma.userStats.update({
    where: { userId },
    data: {
      matchesPlayed,
      matchesWon
    },
    select: userStatsSelect
  });

  return stats;
}

export async function getAllUserStats() {
  const userStats = await prisma.userStats.findMany({
    select: userStatsSelect
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
