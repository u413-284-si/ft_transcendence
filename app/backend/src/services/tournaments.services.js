import prisma from "../prisma/prismaClient.js";

const tournamentSelect = {
  id: true,
  name: true,
  maxPlayers: true,
  isFinished: true,
  userId: true,
  userNickname: true,
  bracket: true,
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

export async function getTournamentTx(tx, id) {
  const tournament = await tx.tournament.findUniqueOrThrow({
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

export async function updateTournamentTx(tx, id, userId, updateData) {
  const updatedTournament = await tx.tournament.update({
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

export async function getUserTournaments(userId) {
  const tournaments = await prisma.tournament.findMany({
    where: {
      userId
    },
    select: tournamentSelect
  });
  return tournaments;
}

export async function getUserActiveTournament(userId) {
  const tournament = await prisma.tournament.findFirst({
    where: {
      userId,
      isFinished: false
    },
    select: tournamentSelect
  });
  return tournament;
}
