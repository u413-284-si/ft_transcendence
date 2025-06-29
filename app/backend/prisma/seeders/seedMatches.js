import { faker } from "@faker-js/faker";

import { createMatch } from "../../src/services/matches.services.js";

export async function seedMatches(userId, count = 10) {
  const matches = [];

  for (let i = 0; i < count; i++) {
    const player1Nickname = faker.internet.username();
    const player2Nickname = faker.internet.username();
    const player1Score = faker.number.int({ min: 0, max: 10 });
    const player2Score = faker.number.int({ min: 0, max: 10 });

    const match = await createMatch(
      userId,
      "PLAYERONE",
      player1Nickname,
      player2Nickname,
      player1Score,
      player2Score,
      null
    );

    matches.push(match);
  }

  return matches;
}
