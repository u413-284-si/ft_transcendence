import { getUserMatches } from "./matches.services.js";
import { getUserStats } from "./user_stats.services.js";

export function computeWinrateLastNMatches(userStats, lastNMatches) {
  const lastNMatchesWithResults = lastNMatches
    .map((match) => ({
      ...match,
      result: didUserWin(match)
    }))
    .reverse();

  const winsInLastN = lastNMatchesWithResults.reduce(
    (acc, match) => acc + (match.result ? 1 : 0),
    0
  );

  const matchesBeforeLastN = Math.max(
    0,
    userStats.matchesPlayed - lastNMatchesWithResults.length
  );

  let cumulativeWins = Math.max(0, userStats.matchesWon - winsInLastN);
  let cumulativeMatches = matchesBeforeLastN;

  let data = [];
  lastNMatchesWithResults.forEach((match) => {
    if (match.result) cumulativeWins++;
    cumulativeMatches++;
    const winrate = (cumulativeWins / cumulativeMatches) * 100;
    data.push({ x: match.date, y: winrate });
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

export function computeScoreDiffLastNMatches(lastNMatches) {
  const data = lastNMatches
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

export function computeScoresLastNDays(matchesLastNDays, N) {
  const { totals } = initializeDailyTotals(N);
  aggregatePlayerScores(matchesLastNDays, totals);
  return Object.entries(totals).map(([x, y]) => ({ x, y }));
}

function initializeDailyTotals(days, valueFactory = () => 0) {
  const totals = {};
  const sortedDates = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = formatDate(date);

    totals[dayStr] = valueFactory();
    sortedDates.push(dayStr);
  }
  return { totals, sortedDates };
}

function aggregatePlayerScores(matches, totals) {
  for (const match of matches) {
    const day = formatDate(match.date);
    if (day in totals) {
      totals[day] += getPlayerScore(match);
    }
  }
}

function getPlayerScore(match) {
  if (match.playedAs === "NONE") return 0;
  if (match.playedAs === "PLAYERONE") {
    return match.player1Score;
  } else if (match.playedAs === "PLAYERTWO") {
    return match.player2Score;
  }
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export async function getDashboardMatchesData(userId) {
  const userStats = await getUserStats(userId);

  const N = 10;

  const select = {
    playedAs: true,
    player1Score: true,
    player2Score: true,
    date: true
  };

  const lastNMatchesFilter = {
    playedAs: ["PLAYERONE", "PLAYERTWO"],
    limit: N,
    sort: "desc"
  };
  const lastNMatches = await getUserMatches(userId, select, lastNMatchesFilter);

  const NDaysAgo = new Date();
  NDaysAgo.setDate(NDaysAgo.getDate() - N);

  const matchesLastNDaysFilter = {
    playedAs: ["PLAYERONE", "PLAYERTWO"],
    date: { gte: NDaysAgo },
    sort: "desc"
  };

  const matchesLastNDays = await getUserMatches(
    userId,
    select,
    matchesLastNDaysFilter
  );

  const winrate = computeWinrateLastNMatches(userStats, lastNMatches);
  const scoreDiff = computeScoreDiffLastNMatches(lastNMatches);
  const scores = computeScoresLastNDays(matchesLastNDays, N);

  return { winrate, scoreDiff, scores };
}
