export async function getUserWinrateProgression(userStats, lastTenMatches) {
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

export async function getUserScoreDiff(lastTenMatches) {
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

export async function getUserScoresLastTen(matchesLastNumDays) {
  const scores = aggregatePlayerScores(matchesLastNumDays);
  const data = fillMissingDays(scores, 10);

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
