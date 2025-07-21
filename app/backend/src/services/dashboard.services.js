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

  for (let i = 0; i < supportedSizes.length; i++) {
    const size = supportedSizes[i];
    summary[size] = { played: 0, won: 0 };
  }

  for (const tournament of tournaments) {
    const size = tournament.maxPlayers;
    const totalRounds = Math.log2(size);

    const wonTournament = tournament.roundReached === totalRounds + 1;

    if (!summary[size]) continue;

    summary[size].played++;
    if (wonTournament) summary[size].won++;
  }

  const wonSeriesData = [];
  const lostSeriesData = [];

  for (const size in summary) {
    const label = `${size}`;
    const { played, won } = summary[size];
    const lost = played - won;

    wonSeriesData.push({ x: label, y: won });
    lostSeriesData.push({ x: label, y: lost });
  }

  wonSeriesData.sort((a, b) => a.x - b.x);
  lostSeriesData.sort((a, b) => a.x - b.x);

  return [
    { name: "won", data: wonSeriesData },
    { name: "lost", data: lostSeriesData }
  ];
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

  return convertProgressToFunnelSeries(progressBySize);
}

function convertProgressToFunnelSeries(progressBySize) {
  const chartData = {};

  for (const size in progressBySize) {
    const roundCounts = progressBySize[size];
    const totalRounds = Object.keys(roundCounts).length;

    const data = Object.entries(roundCounts).map(([round, count]) => {
      const roundNumber = Number(round);
      const label = roundNumber === totalRounds ? "Won" : `Round ${round}`;
      return {
        x: label,
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
      bucket[`won${size}`] = 0;
      bucket[`loss${size}`] = 0;
    }
    return bucket;
  });

  for (const tournament of tournaments) {
    const dayStr = formatDate(tournament.updatedAt);
    if (!totals[dayStr]) continue;

    const size = tournament.maxPlayers;
    const totalRounds = Math.log2(size);
    const won = tournament.roundReached === totalRounds + 1;

    const key = (won ? "won" : "loss") + size;
    if (totals[dayStr][key] !== undefined) {
      totals[dayStr][key]++;
    }
  }

  const series = [];
  for (const size of supportedSizes) {
    series.push(buildSeries(`won${size}`, `Win ${size}`, sortedDates, totals));
    series.push(
      buildSeries(`loss${size}`, `Loss ${size}`, sortedDates, totals)
    );
  }

  return series;
}

function buildSeries(key, name, sortedDates, totals) {
  return {
    name,
    data: sortedDates.map((date) => ({
      x: date,
      y: totals[date][key]
    }))
  };
}
