import prisma from "../prisma/prismaClient.js";

const tournamentSelect = {
  id: true,
  name: true,
  maxPlayers: true,
  bracket: true,
  status: true,
  adminId: true
};

export async function createTournament(name, maxPlayers, adminId, bracket) {
  const tournament = await prisma.tournament.create({
    data: {
      name,
      maxPlayers,
      adminId,
      status: "CREATED",
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

export async function updateTournament(id, adminId, updateData) {
  const updatedTournament = await prisma.tournament.update({
    where: {
      id,
      adminId
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

export async function deleteTournament(id, adminId) {
  const tournament = await prisma.tournament.delete({
    where: {
      id,
      adminId
    },
    select: tournamentSelect
  });
  return tournament;
}

export async function getUserTournaments(id) {
  const tournaments = await prisma.tournament.findMany({
    where: {
      adminId: id
    },
    select: tournamentSelect
  });
  return tournaments;
}

export async function getUserActiveTournament(adminId) {
  const tournament = await prisma.tournament.findFirst({
    where: {
      adminId,
      status: {
        in: ["CREATED", "IN_PROGRESS"]
      }
    },
    select: tournamentSelect
  });
  return tournament;
}
