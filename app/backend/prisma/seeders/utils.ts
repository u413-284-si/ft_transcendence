import { randBoolean, randNumber } from "@ngneat/falso";

export function generateNonTiedScores(
  min = 0,
  max = 10,
  opts?: { winner?: "PLAYERONE" | "PLAYERTWO" }
) {
  const baseScore = randNumber({ min, max: max - 1 });
  const winningScore = randNumber({ min: baseScore + 1, max });
  const player1Wins = opts?.winner
    ? opts.winner === "PLAYERONE"
    : randBoolean();

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

export function randomIncrementalDateFactory({
  from,
  minStepMinutes = 30,
  maxStepMinutes = 240
}: {
  from: Date;
  minStepMinutes?: number;
  maxStepMinutes?: number;
}): () => Date {
  let last = new Date(from);

  return () => {
    const stepMinutes = randNumber({
      min: minStepMinutes,
      max: maxStepMinutes
    });
    last = new Date(last.getTime() + stepMinutes * 60 * 1000);
    return new Date(last);
  };
}
