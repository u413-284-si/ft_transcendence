export async function winrateLastNMatches(userStats, lastNMatches) {
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

export async function scoreDiffLastNMatches(lastNMatches) {
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

export async function scoresLastNDays(matchesLastNDays, N) {
  const scores = aggregatePlayerScores(matchesLastNDays);
  const data = fillMissingDays(scores, N);

  return data;
}

function aggregatePlayerScores(matches) {
  const dailyTotals = {};

  for (const match of matches) {
    const day = formatDate(match.date);
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

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function fillMissingDays(data, days) {
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dayStr = formatDate(date);
    result.push({ x: dayStr, y: data[dayStr] || 0 });
  }

  return result;
}

export async function getUserTournamentSummary(tournaments) {
  const supportedSizes = [4, 8, 16];
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

export async function getUserTournamentProgress(tournaments) {
  const supportedSizes = [4, 8, 16];
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

export function computeTournamentsLastNDays(tournaments) {
  const result = {};

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = formatDate(date);
    result[key] = {
      played4: 0,
      won4: 0,
      played8: 0,
      won8: 0,
      played16: 0,
      won16: 0
    };
  }

  tournaments.forEach((t) => {
    const day = formatDate(t.updatedAt);
    const size = t.maxPlayers;
    const won = t.roundReached === Math.log2(t.maxPlayers) + 1;

    const dayStats = result[day];
    if (!dayStats) return;

    if (size === 4) {
      dayStats.played4++;
      if (won) dayStats.won4++;
    } else if (size === 8) {
      dayStats.played8++;
      if (won) dayStats.won8++;
    } else if (size === 16) {
      dayStats.played16++;
      if (won) dayStats.won16++;
    }
  });

  // Return sorted array for frontend ease
  const sortedData = Object.entries(result)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));

  return sortedData;
}
