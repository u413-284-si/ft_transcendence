import prisma from "../prisma/prismaClient.js";
import { getUserMatches } from "./matches.services.js";

const userStatsSelect = {
  userId: true,
  matchesPlayed: true,
  matchesWon: true
};

export async function updateUserStatsTx(tx, userId, hasWon) {
  const stats = await tx.userStats.update({
    where: { userId },
    data: {
      matchesPlayed: { increment: 1 },
      matchesWon: hasWon ? { increment: 1 } : undefined
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

export async function getUserWinrateProgression(userId) {
  const userStats = await getUserStats(userId);

  const filter = {
    playedAs: ["PLAYERONE", "PLAYERTWO"],
    limit: 10,
    sort: "desc"
  };
  const lastTenMatches = await getUserMatches(userId, filter);

  const lastTenMatchesWithResults = lastTenMatches
    .map((match) => ({
      ...match,
      result: didUserWin(match)
    }))
    .reverse();

  const winsInLastTen = lastTenMatchesWithResults.reduce(
    (acc, m) => acc + (m.result ? 1 : 0),
    0
  );

  const matchesBeforeLastTen = Math.max(
    0,
    userStats.matchesPlayed - lastTenMatchesWithResults.length
  );

  let cumulativeWins = Math.max(0, userStats.matchesWon - winsInLastTen);
  let cumulativeMatches = matchesBeforeLastTen;

  let data = [];
  lastTenMatchesWithResults.forEach((match) => {
    if (match.result) cumulativeWins++;
    cumulativeMatches++;
    const matchNo = cumulativeMatches;
    const winrate = (cumulativeWins / cumulativeMatches) * 100;
    data.push({ x: matchNo.toString(), y: winrate });
  });

  return data;
}

function didUserWin(match) {
  if (!match.playedAs) return false;

  if (match.playedAs === "PLAYERONE") {
    return match.player1Score > match.player2Score;
  } else if (match.playedAs === "PLAYERTWO") {
    return match.player2Score > match.player1Score;
  }

  return false;
}

export async function getUserScoreDiff(userId) {
  const filter = {
    playedAs: ["PLAYERONE", "PLAYERTWO"],
    limit: 10,
    sort: "desc"
  };
  const lastTenMatches = await getUserMatches(userId, filter);

  const data = lastTenMatches
    .map((match) => ({
      x: match.date,
      y: calcScoreDiff(match)
    }))
    .reverse();

  return data;
}

function calcScoreDiff(match) {
  if (!match.playedAs) return 0;

  const userScore =
    match.playedAs === "PLAYERONE" ? match.player1Score : match.player2Score;
  const opponentScore =
    match.playedAs === "PLAYERONE" ? match.player2Score : match.player1Score;

  return userScore - opponentScore;
}

export async function getUserScoresLastTen(userId) {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const filter = {
    playedAs: ["PLAYERONE", "PLAYERTWO"],
    date: { gte: tenDaysAgo },
    sort: "desc"
  };

  const matches = await getUserMatches(userId, filter);

  const scores = aggregatePlayerScores(matches);
  const data = fillMissingDays(scores, 10);

  return data;
}

function aggregatePlayerScores(matches) {
  const dailyTotals = {};

  for (const match of matches) {
    const day = match.date;
    const score = getPlayerScore(match);

    dailyTotals[day] = (dailyTotals[day] || 0) + score;
  }

  return dailyTotals;
}

function getPlayerScore(match) {
  if (match.playedAs === "NONE") return 0;
  if (match.playedAs === "PLAYERONE") {
    return match.player1Score;
  } else if (match.playedAs === "PLAYERTWO") {
    return match.player2Score;
  }
}

function fillMissingDays(data, days) {
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    result.push({ x: date, y: data[date] || 0 });
  }

  return result;
}

export async function getUserWinStreak(userId) {
  const matches = await prisma.match.findMany({
    where: { userId },
    orderBy: {
      date: "asc"
    }
  });
  const data = [];
  let currentStreak = 0;
  let maxStreak = 0;

  matches.forEach((match) => {
    const didWin = didUserWin(match);

    if (didWin) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }

    data.push({
      x: match.date,
      y: currentStreak
    });
  });

  return {
    maxStreak,
    currentStreak,
    data
  };
}
