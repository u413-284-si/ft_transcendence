import prisma from "../prisma/prismaClient.js";
import { getUserStats } from "./user_stats.services.js";

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

export async function getUserMatches(userId, playedAs, filter) {
  const matches = await prisma.match.findMany({
    where: {
      userId: userId,
      ...(playedAs ? { playedAs: { in: playedAs } } : {})
    },
    select: matchSelect,
    take: filter.limit,
    skip: filter.offset,
    orderBy: {
      date: filter.sort
    }
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

export async function getActivityMatrix(userId) {
  const matches = await prisma.match.findMany({
    where: { userId },
    select: { date: true }
  });

  const activityMatrix = Array.from({ length: 7 }, () => Array(24).fill(0));

  for (const match of matches) {
    if (!match.date) continue;

    const d = new Date(match.date);
    const day = d.getDay();
    const hour = d.getHours();

    activityMatrix[day][hour]++;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const series = days.map((dayName, dayIndex) => ({
    name: dayName,
    data: activityMatrix[dayIndex].map((count, hour) => ({
      x: `${hour.toString().padStart(2, "0")}:00`,
      y: count
    }))
  }));

  return series;
}

export async function getUserWinrateProgression(userId) {
  const userStats = await getUserStats(userId);

  const lastTenMatches = await prisma.match.findMany({
    where: { userId },
    orderBy: {
      date: "desc"
    },
    take: 10
  });
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
  const lastTenMatches = await prisma.match.findMany({
    where: { userId },
    orderBy: {
      date: "desc"
    },
    take: 10
  });
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
