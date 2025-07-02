import { randBoolean, randNumber } from "@ngneat/falso";

export function generateNonTiedScores(min = 0, max = 10) {
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

export function makePairKey(a: number, b: number) {
  const [min, max] = a < b ? [a, b] : [b, a];
  return `${min}:${max}`;
}
