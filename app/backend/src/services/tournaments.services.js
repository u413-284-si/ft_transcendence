import prisma from "../prisma/prismaClient.js";

export async function createTournament(name, maxPlayers, adminId) {
  const tournament = await prisma.tournament.create({
    data: {
      name,
      maxPlayers,
      adminId,
      status: "CREATED"
    }
  });
  return tournament;
}

export async function getAllTournaments() {
  const tournaments = await prisma.tournament.findMany();
  return tournaments;
}

export async function getTournament(id) {
  const tournament = await prisma.tournament.findUniqueOrThrow({
    where: {
      id
    }
  });
  return tournament;
}

export async function updateTournament(id, updateData) {
  const updatedTournament = await prisma.tournament.update({
    where: {
      id
    },
    data: updateData
  });
  return updatedTournament;
}
