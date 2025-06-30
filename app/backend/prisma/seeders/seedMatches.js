import { faker } from "@faker-js/faker";
import { transactionMatch } from "../../src/services/transactions.services.js";

function generateNonTiedScores(min = 0, max = 10) {
  const baseScore = faker.number.int({ min, max: max - 1 });
  const player1Wins = faker.datatype.boolean();
  const winningScore = faker.number.int({ min: baseScore + 1, max });
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
    const playedAs = faker.helpers.arrayElement(["PLAYERONE", "PLAYERTWO"]);
    const player1Nickname = faker.internet.username();
    const player2Nickname = faker.internet.username();
    const { player1Score, player2Score } = generateNonTiedScores(0, 10);
    const date = faker.date.past();

    const match = await transactionMatch(
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

  return matches;
}
