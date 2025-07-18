import { getUserTournaments } from "./tournaments.services.js";

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
  const summary = {};

  for (const tournament of tournaments) {
    const size = tournament.maxPlayers;
    const user = tournament.userNickname;
    const totalRounds = Math.log2(size);
    let wins = 0;

    for (const match of tournament.matches) {
      let playedAs = null;

      if (match.player1Nickname === user) playedAs = "PLAYERONE";
      else if (match.player2Nickname === user) playedAs = "PLAYERTWO";

      const won =
        (playedAs === "PLAYERONE" && match.player1Score > match.player2Score) ||
        (playedAs === "PLAYERTWO" && match.player2Score > match.player1Score);

      if (won) wins++;
    }

    const wonTournament = wins === totalRounds;

    if (!summary[size]) {
      summary[size] = { played: 0, won: 0 };
    }

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
  const progressBySize = {};

  for (const tournament of tournaments) {
    const size = tournament.maxPlayers;
    const totalRounds = Math.log2(size);
    const user = tournament.userNickname;

    // Filter matches where the user played
    const userMatches = tournament.matches.filter(
      (m) => m.player1Nickname === user || m.player2Nickname === user
    );

    const matchesPlayed = userMatches.length;

    if (matchesPlayed === 0) continue;

    // Determine if user won last match
    const lastMatch = userMatches[userMatches.length - 1];
    const playedAs =
      lastMatch.player1Nickname === user ? "PLAYERONE" : "PLAYERTWO";
    const wonLastMatch =
      (playedAs === "PLAYERONE" &&
        lastMatch.player1Score > lastMatch.player2Score) ||
      (playedAs === "PLAYERTWO" &&
        lastMatch.player2Score > lastMatch.player1Score);

    let roundsReached = matchesPlayed;
    if (wonLastMatch && matchesPlayed === totalRounds) {
      roundsReached++; // they won the final → full progress
    }

    if (!progressBySize[size]) {
      progressBySize[size] = {};
      for (let i = 1; i <= totalRounds + 1; i++) {
        progressBySize[size][i] = 0;
      }
    }

    // Count all rounds up to what they reached
    for (let i = 1; i <= roundsReached; i++) {
      progressBySize[size][i]++;
    }
  }

  const data = convertProgressToFunnelSeries(progressBySize);

  return data;
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
