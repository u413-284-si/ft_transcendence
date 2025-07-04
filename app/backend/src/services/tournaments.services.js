import prisma from "../prisma/prismaClient.js";

const tournamentSelect = {
  id: true,
  name: true,
  maxPlayers: true,
  status: true,
  userId: true,
  userNickname: true,
  bracket: true
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
      status: "CREATED",
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
      status: {
        in: ["CREATED", "IN_PROGRESS"]
      }
    },
    select: tournamentSelect
  });
  return tournament;
}

export async function getUserTournamentProgress(userId) {
  const tournaments = await prisma.tournament.findMany({
    where: {
      userId,
      status: "FINISHED"
    },
    select: {
      maxPlayers: true,
      userNickname: true,
      matches: {
        select: {
          player1Nickname: true,
          player2Nickname: true,
          player1Score: true,
          player2Score: true
        }
      }
    }
  });

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
