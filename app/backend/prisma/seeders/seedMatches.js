import {
  rand,
  randBoolean,
  randNumber,
  randPastDate,
  randUserName
} from "@ngneat/falso";

import { transactionMatch } from "../../src/services/transactions.services.js";

function generateNonTiedScores(min = 0, max = 10) {
  const baseScore = randNumber({ min, max: max - 1 });
  const player1Wins = randBoolean();
  const winningScore = randNumber({ min: baseScore + 1, max });
  if (player1Wins) {
    return {
      player1Score: winningScore,
      player2Score: baseScore
    };
  } else {
    return {
      player1Score: baseScore,
      player2Score: winningScore
    };
  }
}

export async function seedMatches(userId, count = 10) {
  const matches = [];

  for (let i = 0; i < count; i++) {
    const playedAs = rand(["PLAYERONE", "PLAYERTWO"]);
    const player1Nickname = randUserName({ withAccents: false });
    const player2Nickname = randUserName({ withAccents: false });
    const { player1Score, player2Score } = generateNonTiedScores(0, 10);
    const date = randPastDate();

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

export async function seedMatchesPerUser(users, min, max) {
  const allMatches = [];

  for (const user of users) {
    const matchCount = randNumber({ min, max });
    const matches = await seedMatches(user.id, matchCount);
    allMatches.push(...matches);
  }

  console.log(`Seeded ${allMatches.length} matches`);
  return allMatches;
}
