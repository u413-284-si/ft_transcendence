import { rand, randNumber, randPastDate, randUserName } from "@ngneat/falso";

import { transactionMatch } from "../../src/services/transactions.services.js";
import {
  generateNonTiedScores,
  randomIncrementalDateFactory
} from "./utils.ts";

import type { Match } from "../../../frontend/src/types/IMatch.ts";
import type { User } from "@prisma/client";

export async function seedMatchesPerUser(users: User[], min = 1, max = 10) {
  const allMatches: Match[] = [];

  for (const user of users) {
    const matchCount = randNumber({ min, max });
    const matches = await seedMatches(user.id, matchCount);
    allMatches.push(...matches);
  }

  console.log(`Seeded ${allMatches.length} matches`);
  return allMatches;
}

export async function seedMatches(userId: number, count = 10) {
  const matches: Match[] = [];
  const nextDate = randomIncrementalDateFactory({
    from: randPastDate(),
    minStepMinutes: 30,
    maxStepMinutes: 3000
  });

  for (let i = 0; i < count; i++) {
    const playedAs = rand(["PLAYERONE", "PLAYERTWO"]);
    const player1Nickname = randUserName({ withAccents: false });
    const player2Nickname = randUserName({ withAccents: false });
    const { player1Score, player2Score } = generateNonTiedScores(0, 10);
    const date = nextDate();

    const { match } = await transactionMatch(
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      null,
      date
    );

    matches.push(match);
  }

  console.log(`Seeded ${matches.length} matches for userId ${userId}`);
  return matches;
}
