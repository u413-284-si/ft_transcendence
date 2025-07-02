import {
  incrementalDate,
  rand,
  randNoun,
  randPastDate,
  randUserName
} from "@ngneat/falso";
import { Tournament } from "/workspaces/ft_transcendence/app/frontend/src/Tournament.ts";
import {
  createTournament,
  updateTournament
} from "../../src/services/tournaments.services.js";
import { transactionMatch } from "../../src/services/transactions.services.js";
import { generateNonTiedScores } from "./utils.ts";

import type { BracketMatch } from "../../../frontend/src/types/IMatch.ts";

export async function seedTournament(userId: number) {
  const tournamentName = randNoun();
  const numberOfPlayers = rand([4, 8, 16]);
  const playerNicknames = Array.from({ length: numberOfPlayers }, () =>
    randUserName({ withAccents: false })
  );
  const userNickname = rand(playerNicknames);

  const tournament = Tournament.fromUsernames(
    playerNicknames,
    tournamentName,
    numberOfPlayers,
    userNickname,
    userId
  );

  const bracket = JSON.stringify(tournament.getBracket());

  const { id } = await createTournament(
    tournamentName,
    numberOfPlayers,
    userId,
    userNickname,
    bracket
  );

  tournament.setId(id);

  const randomStartDate = randPastDate({ years: 1 });
  const dateFactory = incrementalDate({
    from: randomStartDate,
    step: 10 * 60 * 1000 // 10 minutes in milliseconds
  });

  let nextMatch: BracketMatch | null;
  while ((nextMatch = tournament.getNextMatchToPlay()) != null) {
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

    tournament.updateBracketWithResult(nextMatch.matchId, winner);
    const match = await transactionMatch(
      userId,
      playedAs === "NONE" ? null : playedAs,
      nextMatch.player1,
      nextMatch.player2,
      player1Score,
      player2Score,
      { id: tournament!.getId(), name: tournament!.getTournamentName() },
      date
    );
  }
  const newTournament = await updateTournament(tournament.getId(), userId, {
    bracket: tournament.getBracket(),
    status: "FINISHED"
  });
  console.log(
    `Seeded tournament ${tournamentName} with ${numberOfPlayers} players`
  );
  return newTournament;
}
