import { getUserMatches } from "./matches.services.js";
import { getUserTournaments } from "./tournaments.services.js";
import { getUserStats } from "./user_stats.services.js";

const supportedSizes = [4, 8, 16];

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

export function computeTournamentSummary(tournaments) {
  const summary = {};

  for (const size of supportedSizes) {
    summary[size] = { played: 0, won: 0 };
  }

  // Populate the data
  for (const tournament of tournaments) {
    const size = tournament.maxPlayers;
    const totalRounds = Math.log2(size);
    const wonTournament = tournament.roundReached === totalRounds + 1;

    if (!summary[size]) continue;

    summary[size].played++;
    if (wonTournament) summary[size].won++;
  }

  const data = [];

  for (const size of supportedSizes) {
    const { played, won } = summary[size];
    const winrate = played > 0 ? Math.round((won / played) * 100) : 0;

    data.push({ size, winrate, played, won });
  }

  return { data };
}

export function computeTournamentProgress(tournaments) {
  const progressBySize = {};

  for (const size of supportedSizes) {
    const totalRounds = Math.log2(size);
    progressBySize[size] = {};

    for (let i = 1; i <= totalRounds + 1; i++) {
      progressBySize[size][i] = 0;
    }
  }

  for (const tournament of tournaments) {
    const size = tournament.maxPlayers;
    const roundsReached = tournament.roundReached;

    if (!progressBySize[size]) continue;

    for (let i = 1; i <= roundsReached; i++) {
      progressBySize[size][i]++;
    }
  }

  return convertToChartData(progressBySize);
}

function convertToChartData(progressBySize) {
  const chartData = {};

  for (const size in progressBySize) {
    const roundCounts = progressBySize[size];

    const data = Object.entries(roundCounts).map(([round, count]) => {
      return {
        x: round,
        y: count
      };
    });

    chartData[size] = data;
  }

  return chartData;
}

export function computeTournamentsLastNDays(tournaments, days) {
  const { totals, sortedDates } = initializeDailyTotals(days, () => {
    const bucket = {};
    for (const size of supportedSizes) {
      bucket[size] = { win: 0, loss: 0 };
    }
    return bucket;
  });

  for (const tournament of tournaments) {
    const dayStr = formatDate(tournament.updatedAt);
    if (!totals[dayStr]) continue;

    const size = tournament.maxPlayers;
    const totalRounds = Math.log2(size);
    const won = tournament.roundReached === totalRounds + 1;

    if (totals[dayStr][size]) {
      if (won) {
        totals[dayStr][size].win++;
      } else {
        totals[dayStr][size].loss++;
      }
    }
  }

  const result = {};

  for (const size of supportedSizes) {
    const winSeries = [];
    const lossSeries = [];

    for (const date of sortedDates) {
      const dayData = totals[date][size];
      winSeries.push({ x: date, y: dayData.win });
      lossSeries.push({ x: date, y: dayData.loss });
    }

    result[size] = [
      { name: "win", data: winSeries },
      { name: "loss", data: lossSeries }
    ];
  }

  return result;
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

export async function getDashboardTournamentsData(userId) {
  const allSelect = {
    maxPlayers: true,
    roundReached: true
  };

  const allFinishedFilter = {
    isFinished: true
  };

  const allTournaments = await getUserTournaments(
    userId,
    allSelect,
    allFinishedFilter
  );

  const lastNDaysSelect = {
    maxPlayers: true,
    roundReached: true,
    updatedAt: true
  };
  const N = 10;
  const NDaysAgo = new Date();
  NDaysAgo.setDate(NDaysAgo.getDate() - N);

  const finishedLastNDaysFilter = {
    isFinished: true,
    updatedAt: { gte: NDaysAgo }
  };

  const tournamentsLastNDays = await getUserTournaments(
    userId,
    lastNDaysSelect,
    finishedLastNDaysFilter
  );

  const summary = computeTournamentSummary(allTournaments);
  const progress = computeTournamentProgress(allTournaments);
  const lastTenDays = computeTournamentsLastNDays(tournamentsLastNDays, N);

  return { summary, progress, lastTenDays };
}
