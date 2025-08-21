import prisma from "../prisma/prismaClient.js";

const tournamentSelect = {
  id: true,
  name: true,
  maxPlayers: true,
  isFinished: true,
  userId: true,
  userNickname: true,
  roundReached: true,
  updatedAt: true
};

export async function createTournament(
  name,
  maxPlayers,
  userId,
  userNickname,
  bracket
) {
  const tournament = await prisma.tournament.create({
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

export async function getAllTournaments() {
  const tournaments = await prisma.tournament.findMany({
    select: tournamentSelect
  });
  return tournaments;
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

  for (let r = 0; r < roundMatches.length - 1; r++) {
    const current = roundMatches[r];
    const next = roundMatches[r + 1];
    for (let i = 0; i < current.length; i++) {
      const match = bracket.find((m) => m.matchNumber === current[i]);
      match.nextMatchNumber = next[Math.floor(i / 2)];
      match.winnerSlot = i % 2 === 0 ? 1 : 2;
    }
  }

  const firstRound = roundMatches[0];
  for (let i = 0; i < nicknames.length; i += 2) {
    const match = bracket.find((m) => m.matchNumber === firstRound[i / 2]);
    match.player1Nickname = nicknames[i];
    match.player2Nickname = nicknames[i + 1];
    match.player1Type = playerTypes[i] || "HUMAN";
    match.player2Type = playerTypes[i + 1] || "HUMAN";
  }

  return bracket;
}
