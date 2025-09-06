import prisma from "../prisma/prismaClient.js";
import { shuffle, unzip, zip } from "../utils/array.js";

const tournamentSelect = {
  id: true,
  name: true,
  maxPlayers: true,
  isFinished: true,
  userNickname: true,
  roundReached: true,
  updatedAt: true,
  bracket: {
    select: {
      matchNumber: true,
      round: true,
      player1Nickname: true,
      player2Nickname: true,
      player1Type: true,
      player2Type: true,
      winner: true,
      nextMatchNumber: true,
      winnerSlot: true
    }
  }
};

export async function createTournamentTx(
  tx,
  name,
  maxPlayers,
  userId,
  userNickname,
  bracket
) {
  const tournament = await tx.tournament.create({
    data: {
      name,
      maxPlayers,
      userId,
      userNickname,
      bracket
    },
    select: tournamentSelect
  });
  return tournament;
}

export async function getTournament(id) {
  const tournament = await prisma.tournament.findUniqueOrThrow({
    where: {
      id
    },
    select: tournamentSelect
  });
  return tournament;
}

export async function updateTournament(id, userId, updateData) {
  const updatedTournament = await prisma.tournament.update({
    where: {
      id,
      userId
    },
    data: updateData,
    select: tournamentSelect
  });
  return updatedTournament;
}

export async function deleteAllTournaments() {
  const tournaments = await prisma.tournament.deleteMany();
  return tournaments;
}

export async function deleteTournament(id, userId) {
  const tournament = await prisma.tournament.delete({
    where: {
      id,
      userId
    },
    select: tournamentSelect
  });
  return tournament;
}

export async function getUserTournaments(
  userId,
  select = tournamentSelect,
  filter = {}
) {
  const tournaments = await prisma.tournament.findMany({
    where: {
      userId: userId,
      ...(filter.tournamentId ? { id: filter.tournamentId } : {}),
      ...(filter.isFinished !== undefined
        ? { isFinished: filter.isFinished }
        : {}),
      ...(filter.updatedAt ? { updatedAt: filter.updatedAt } : {}),
      ...(filter.name ? { name: filter.name } : {})
    },
    select: select,
    take: filter.limit,
    skip: filter.offset,
    orderBy: {
      updatedAt: filter.sort
    }
  });
  return tournaments;
}

export async function getUserTournamentsCount(userId, filter = {}) {
  const total = await prisma.tournament.count({
    where: {
      userId: userId,
      ...(filter.isFinished !== undefined
        ? { isFinished: filter.isFinished }
        : {}),
      ...(filter.updatedAt ? { updatedAt: filter.updatedAt } : {}),
      ...(filter.name ? { name: filter.name } : {})
    }
  });
  return total;
}

export function generateBracket(nicknames, playerTypes, numberOfPlayers) {
  let combined = zip(nicknames, playerTypes);
  combined = shuffle(combined);
  const [shuffledNames, shuffledTypes] = unzip(combined);
  const totalRounds = Math.log2(numberOfPlayers);
  const bracket = [];
  let currentMatchId = 1;

  const roundMatches = [];
  let matchCount = numberOfPlayers / 2;

  for (let round = 1; round <= totalRounds; round++) {
    const matchIds = [];
    for (let i = 0; i < matchCount; i++) {
      bracket.push({
        matchNumber: currentMatchId,
        round: round,
        player1Nickname: null,
        player2Nickname: null,
        player1Type: null,
        player2Type: null,
        winner: null,
        nextMatchNumber: null,
        winnerSlot: null
      });
      matchIds.push(currentMatchId++);
    }
    roundMatches.push(matchIds);
    matchCount /= 2;
  }

  const bracketMap = Object.fromEntries(bracket.map((m) => [m.matchNumber, m]));

  for (let r = 0; r < roundMatches.length - 1; r++) {
    const current = roundMatches[r];
    const next = roundMatches[r + 1];
    for (let i = 0; i < current.length; i++) {
      const match = bracketMap[current[i]];
      match.nextMatchNumber = next[Math.floor(i / 2)];
      match.winnerSlot = i % 2 === 0 ? 1 : 2;
    }
  }

  const firstRound = roundMatches[0];
  for (let i = 0; i < numberOfPlayers; i += 2) {
    const match = bracketMap[firstRound[i / 2]];
    match.player1Nickname = shuffledNames[i];
    match.player2Nickname = shuffledNames[i + 1];
    match.player1Type = shuffledTypes[i];
    match.player2Type = shuffledTypes[i + 1];
  }

  return bracket;
}
