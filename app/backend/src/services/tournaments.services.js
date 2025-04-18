import prisma from "../prisma/prismaClient.js";

export async function createTournament(name, maxPlayers, adminId, bracket) {
  const tournament = await prisma.tournament.create({
    data: {
      name,
      maxPlayers,
      adminId,
      status: "CREATED",
      bracket
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

export async function updateTournament(id, adminId, updateData) {
  const updatedTournament = await prisma.tournament.update({
    where: {
      id,
      adminId
    },
    data: updateData
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
    }
  });
  return tournament;
}

export async function getUserTournaments(id) {
  const tournaments = await prisma.tournament.findMany({
    where: {
      adminId: id
    }
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
    }
  });
  return tournament;
}
