import {
  incrementalDate,
  rand,
  randChanceBoolean,
  randFloat,
  randNoun,
  randNumber,
  randRecentDate,
  randUserName
} from "@ngneat/falso";
import { updateTournament } from "../../src/services/tournaments.services.js";
import {
  transactionTournament,
  transactionUpdateBracket
} from "../../src/services/transactions.services.js";
import { generateNonTiedScores } from "./utils.ts";

import type { User } from "@prisma/client";
import type { TournamentRead } from "../../../frontend/src/types/ITournament.ts";
import type { BracketMatchRead } from "../../../frontend/src/types/BracketMatch.ts";

export async function seedTournamentsPerUser(
  users: User[],
  min = 1,
  max = 10,
  winRateMin = 0,
  winRateMax = 1
) {
  const allTournaments: TournamentRead[] = [];

  for (const user of users) {
    const tournamentCount = randNumber({ min, max });
    const tournaments = await seedTournaments(
      user.id,
      tournamentCount,
      randFloat({ min: winRateMin, max: winRateMax })
    );
    allTournaments.push(...tournaments);
  }

  console.log(`Seeded ${allTournaments.length} tournaments`);
  return allTournaments;
}

export async function seedTournaments(
  userId: number,
  count = 10,
  winRate = 0.5
) {
  const tournaments: TournamentRead[] = [];

  for (let i = 0; i < count; i++) {
    const tournament = await seedSingleTournament(userId, winRate);
    tournaments.push(tournament);
  }
  console.log(`Seeded ${tournaments.length} tournaments for userId ${userId}`);
  return tournaments;
}

export async function seedSingleTournament(userId: number, winRate = 0.5) {
  const tournamentName = randNoun();
  const numberOfPlayers = rand([4, 8, 16]);
  const playerNicknames = Array.from({ length: numberOfPlayers }, () =>
    randUserName({ withAccents: false }).slice(0, 20)
  );
  const userNickname = rand(playerNicknames);
  const playerTypes = new Array(numberOfPlayers).fill("HUMAN");

  const tournamentDTO: TournamentRead = await transactionTournament(
    tournamentName,
    numberOfPlayers,
    userId,
    userNickname,
    playerNicknames,
    playerTypes
  );

  const randomStartDate = randRecentDate({ days: 10 });
  const dateFactory = incrementalDate({
    from: randomStartDate,
    step: 1 * 60 * 1000 // 1 minute in milliseconds
  });

  let nextMatch: BracketMatchRead | null;
  while ((nextMatch = getNextMatchToPlay(tournamentDTO.bracket)) != null) {
    const userInMatch =
      userNickname === nextMatch.player1Nickname ||
      userNickname === nextMatch.player2Nickname;

    const userWins = userInMatch
      ? randChanceBoolean({ chanceTrue: winRate })
      : false;

    const { player1Score, player2Score } = generateNonTiedScores(0, 10, {
      winner: userWins
        ? userNickname === nextMatch.player1Nickname
          ? "PLAYERONE"
          : "PLAYERTWO"
        : undefined
    });

    const winner =
      player1Score > player2Score
        ? nextMatch.player1Nickname!
        : nextMatch.player2Nickname!;

    updateBracketWithResult(
      tournamentDTO.bracket,
      nextMatch.matchNumber,
      winner
    );

    const date = dateFactory();

    const playedAs =
      tournamentDTO.userNickname === nextMatch.player1Nickname
        ? "PLAYERONE"
        : tournamentDTO.userNickname === nextMatch.player2Nickname
          ? "PLAYERTWO"
          : "NONE";

    const hasUserWon = winner === tournamentDTO.userNickname;
    console.dir(nextMatch);
    await transactionUpdateBracket(
      userId,
      player1Score,
      player2Score,
      playedAs,
      hasUserWon,
      { ...nextMatch, tournamentId: tournamentDTO.id },
      date
    );
  }

  const tournament = await updateTournament(tournamentDTO.id, userId, {
    isFinished: true,
    updatedAt: dateFactory()
  });
  return tournament;
}

function getNextMatchToPlay(
  bracket: BracketMatchRead[]
): BracketMatchRead | null {
  return (
    bracket.find((m) => m.player1Nickname && m.player2Nickname && !m.winner) ??
    null
  );
}

function updateBracketWithResult(
  bracket: BracketMatchRead[],
  matchNumber: number,
  winner: string
) {
  const match = bracket.find((m) => m.matchNumber === matchNumber);
  if (!match) throw new Error(`Match ${matchNumber} not found`);

  match.winner = winner;

  if (match.nextMatchNumber && match.winnerSlot) {
    const nextMatch = bracket.find(
      (m) => m.matchNumber === match.nextMatchNumber
    );
    if (!nextMatch)
      throw new Error(`Next match ${match.nextMatchNumber} not found`);

    const winnerType =
      winner === match.player1Nickname ? match.player1Type : match.player2Type;

    if (match.winnerSlot === 1) {
      nextMatch.player1Nickname = winner;
      nextMatch.player1Type = winnerType;
    } else if (match.winnerSlot === 2) {
      nextMatch.player2Nickname = winner;
      nextMatch.player2Type = winnerType;
    }
  }
}
