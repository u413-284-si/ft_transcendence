import type { PlayerType } from "./types/IMatch";
import type { GameState } from "./types/IGameState";

type PlayerSide = "left" | "right";

const AI_CONFIG = {
  AI_EASY: { reactionInterval: 1300, predictionError: 80, tolerance: 0 },
  AI_MEDIUM: { reactionInterval: 1000, predictionError: 65, tolerance: 10 },
  AI_HARD: { reactionInterval: 1000, predictionError: 0, tolerance: 15 }
} as const;

export class AIPlayer {
  private side: PlayerSide;

  private lastSeenBallX: number = 0;
  private lastSeenBallY: number = 0;
  private lastSeenBallSpeedX: number = 0;
  private lastSeenBallSpeedY: number = 0;
  private predictionY: number = 0;
  private lastUpdate: number = 0;

  private reactionInterval: number;
  private predictionError: number;
  private tolerance: number;

  constructor(
    side: PlayerSide,
    options: {
      reactionInterval?: number;
      predictionError?: number;
      tolerance?: number;
    } = {}
  ) {
    this.side = side;

    this.reactionInterval = options.reactionInterval ?? 1000;
    this.predictionError = options.predictionError ?? 65;
    this.tolerance = options.tolerance ?? 10;
  }

  updatePerception(gameState: GameState) {
    const now: number = performance.now();
    if (now - this.lastUpdate < this.reactionInterval) {
      return;
    }
    this.lastSeenBallX = gameState.ballX;
    this.lastSeenBallY = gameState.ballY;
    this.lastSeenBallSpeedX = gameState.ballSpeedX;
    this.lastSeenBallSpeedY = gameState.ballSpeedY;

    const paddleX =
      this.side === "left" ? gameState.paddle1X : gameState.paddle2X;
    this.predictionY = this.predictImpactY(gameState, paddleX);

    this.lastUpdate = performance.now();
  }

  predictImpactY(gameState: GameState, paddleX: number): number {
    const x0 = this.lastSeenBallX;
    const y0 = this.lastSeenBallY;
    const vx = this.lastSeenBallSpeedX;
    const vy = this.lastSeenBallSpeedY;

    if (
      (this.side === "right" && vx <= 0) ||
      (this.side === "left" && vx >= 0)
    ) {
      return y0;
    }

    const timeToPaddle = (paddleX - x0) / vx;

    let predictedY = y0 + vy * timeToPaddle;

    while (predictedY < 0 || predictedY > gameState.canvasHeight) {
      if (predictedY < 0) {
        predictedY = -predictedY;
      } else if (predictedY > gameState.canvasHeight) {
        predictedY = 2 * gameState.canvasHeight - predictedY;
      }
    }

    const noise = (Math.random() * 2 - 1) * this.predictionError;
    return predictedY + noise;
  }

  decideMove(paddleY: number, paddleHeight: number): "up" | "down" | "none" {
    const targetY = this.predictionY;

    const paddleCenter = paddleY + paddleHeight / 2;

    if (targetY < paddleCenter - this.tolerance) {
      return "up";
    } else if (targetY > paddleCenter + this.tolerance) {
      return "down";
    } else {
      return "none";
    }
  }

  reset() {
    this.lastUpdate = 0;
    this.predictionY = 0;
  }
}

export function maybeCreateAI(
  side: "left" | "right",
  type: PlayerType
): AIPlayer | null {
  if (type === "HUMAN") return null;
  return new AIPlayer(side, AI_CONFIG[type]);
}
