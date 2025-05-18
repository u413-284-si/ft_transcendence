import prisma from "../prisma/prismaClient.js";

const userStatsSelect = {
  userId: true,
  matchesPlayed: true,
  matchesWon: true,
  matchesLost: true,
  winRate: true
};

export async function updateUserStats(userId, won) {
  const userStats = await prisma.userStats.findUnique({
    where: { userId },
    select: { matchesPlayed: true, matchesWon: true }
  });

  const matchesPlayed = userStats.matchesPlayed + 1;
  const matchesWon = userStats.matchesWon + (won ? 1 : 0);
  const winRate = (matchesWon / matchesPlayed) * 100;

  const stats = await prisma.userStats.update({
    where: { userId },
    data: {
      matchesPlayed,
      matchesWon,
      matchesLost: { increment: won ? 0 : 1 },
      winRate
    },
    select: userStatsSelect
  });

  return stats;
}

export async function getAllUserStats() {
  const userStats = await prisma.userStats.findMany({
    select: userStatsSelect
  });
  return userStats;
}

export async function getUserStats(userId) {
  const userStat = await prisma.userStats.findUniqueOrThrow({
    where: {
      userId
    },
    select: userStatsSelect
  });
  return userStat;
}

export async function deleteAllUserStats() {
  const userStats = await prisma.userStats.deleteMany();
  return userStats;
}
