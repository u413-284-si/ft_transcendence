import {
  rand,
  randChanceBoolean,
  randFloat,
  randNumber,
  randRecentDate,
  randUserName
} from "@ngneat/falso";

import { transactionMatch } from "../../src/services/transactions.services.js";
import {
  generateNonTiedScores,
  randomIncrementalDateFactory
} from "./utils.ts";

import type { User } from "@prisma/client";
import { MatchRead } from "../../../frontend/src/types/IMatch.ts";

export async function seedMatchesPerUser(
  users: User[],
  min = 1,
  max = 10,
  winRateMin = 0,
  winRateMax = 1
) {
  const allMatches: MatchRead[] = [];

  for (const user of users) {
    const matchCount = randNumber({ min, max });
    const matches = await seedMatches(
      user.id,
      matchCount,
      randFloat({ min: winRateMin, max: winRateMax })
    );
    allMatches.push(...matches);
  }

  console.log(`Seeded ${allMatches.length} matches`);
  return allMatches;
}

export async function seedMatches(userId: number, count = 10, winRate = 0.5) {
  const matches: MatchRead[] = [];
  const nextDate = randomIncrementalDateFactory({
    from: randRecentDate({ days: 10 }),
    minStepMinutes: 1,
    maxStepMinutes: 5
  });

  for (let i = 0; i < count; i++) {
    const playedAs = rand(["PLAYERONE", "PLAYERTWO"]);
    const player1Nickname = randUserName({ withAccents: false });
    const player2Nickname = randUserName({ withAccents: false });
    const date = nextDate();

    const userWins = randChanceBoolean({ chanceTrue: winRate });

    const { player1Score, player2Score } = generateNonTiedScores(0, 10, {
      winner:
        playedAs === "PLAYERONE"
          ? userWins
            ? "PLAYERONE"
            : "PLAYERTWO"
          : userWins
            ? "PLAYERTWO"
            : "PLAYERONE"
    });

    const { match } = await transactionMatch(
      userId,
      playedAs,
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      "HUMAN",
      "HUMAN",
      null,
      date
    );

    matches.push(match);
  }

  console.log(`Seeded ${matches.length} matches for userId ${userId}`);
  return matches;
}
