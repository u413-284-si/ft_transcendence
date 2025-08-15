import {
  incrementalDate,
  rand,
  randNoun,
  randNumber,
  randRecentDate,
  randUserName
} from "@ngneat/falso";
import { Tournament } from "../../../frontend/src/Tournament.ts";
import {
  createTournament,
  updateTournament
} from "../../src/services/tournaments.services.js";
import { transactionMatch } from "../../src/services/transactions.services.js";
import { generateNonTiedScores } from "./utils.ts";

import type { BracketMatch } from "../../../frontend/src/types/IMatch.ts";
import type { Tournament as TournamentType, User } from "@prisma/client";
type PublicTournament = Omit<TournamentType, "isPrivate">;

export async function seedTournamentsPerUser(users: User[], min = 1, max = 10) {
  const allTournaments: PublicTournament[] = [];

  for (const user of users) {
    const tournamentCount = randNumber({ min, max });
    const tournaments = await seedTournaments(user.id, tournamentCount);
    allTournaments.push(...tournaments);
  }

  console.log(`Seeded ${allTournaments.length} tournaments`);
  return allTournaments;
}

export async function seedTournaments(userId: number, count = 10) {
  const tournaments: PublicTournament[] = [];

  for (let i = 0; i < count; i++) {
    const tournament = await seedSingleTournament(userId);
    tournaments.push(tournament);
  }
  console.log(`Seeded ${tournaments.length} tournaments for userId ${userId}`);
  return tournaments;
}

export async function seedSingleTournament(userId: number) {
  const tournamentName = randNoun();
  const numberOfPlayers = rand([4, 8, 16]);
  const playerNicknames = Array.from({ length: numberOfPlayers }, () =>
    randUserName({ withAccents: false })
  );
  const userNickname = rand(playerNicknames);

  const tournamentClass = Tournament.fromUsernames(
    playerNicknames,
    tournamentName,
    numberOfPlayers,
    userNickname,
    userId
  );

  const bracket = JSON.stringify(tournamentClass.getBracket());

  const { id } = await createTournament(
    tournamentName,
    numberOfPlayers,
    userId,
    userNickname,
    bracket
  );

  tournamentClass.setId(id);

  const randomStartDate = randRecentDate({ days: 10 });
  const dateFactory = incrementalDate({
    from: randomStartDate,
    step: 1 * 60 * 1000 // 1 minute in milliseconds
  });

  let nextMatch: BracketMatch | null;
  while ((nextMatch = tournamentClass.getNextMatchToPlay()) != null) {
    const playedAs =
      userNickname === nextMatch.player1!
        ? "PLAYERONE"
        : userNickname === nextMatch.player2!
          ? "PLAYERTWO"
          : "NONE";
    const { player1Score, player2Score } = generateNonTiedScores(0, 10);
    const winner =
      player1Score > player2Score ? nextMatch.player1! : nextMatch.player2!;
    const date = dateFactory();

    tournamentClass.updateBracketWithResult(nextMatch.matchId, winner);
    await transactionMatch(
      userId,
      playedAs,
      nextMatch.player1,
      nextMatch.player2,
      player1Score,
      player2Score,
      {
        id: tournamentClass!.getId(),
        name: tournamentClass!.getTournamentName()
      },
      date
    );
  }
  const tournament = await updateTournament(tournamentClass.getId(), userId, {
    bracket: tournamentClass.getBracket(),
    isFinished: true,
    roundReached: tournamentClass.getRoundReached(),
    updatedAt: dateFactory()
  });
  console.log(
    `Seeded tournament ${tournamentName} with ${numberOfPlayers} players`
  );
  return tournament;
}
