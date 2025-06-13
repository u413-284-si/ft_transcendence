import { GameState } from "./types/IGameState";

export class AIPlayer {
  lastSeenBallX: number;
  lastSeenBallY: number;
  lastSeenBallSpeedX: number;
  lastSeenBallSpeedY: number;
  predictionY: number;
  lastUpdate: number;

  reactionInterval: number;
  predictionError: number;
  maxPaddleSpeed: number;
  tolerance: number;
  smoothingFactor: number;

  constructor(
    reactionInterval = 1000,
    predictionError = 0,
    maxPaddleSpeed = 300,
    tolerance = 15,
    smoothingFactor: 0.2
  ) {
    this.lastSeenBallX = 0;
    this.lastSeenBallY = 0;
    this.lastSeenBallSpeedX = 0;
    this.lastSeenBallSpeedY = 0;
    this.predictionY = 0;
    this.lastUpdate = performance.now();

    this.reactionInterval = reactionInterval;
    this.predictionError = predictionError;
    this.maxPaddleSpeed = maxPaddleSpeed;
    this.tolerance = tolerance;
    this.smoothingFactor = smoothingFactor;
  }

  updatePerception(gameState: GameState) {
    this.lastSeenBallX = gameState.ballX;
    this.lastSeenBallY = gameState.ballY;
    this.lastSeenBallSpeedX = gameState.ballSpeedX;
    this.lastSeenBallSpeedY = gameState.ballSpeedY;

    const rawPrediction = this.predictImpactY(gameState);

    // Smooth it: blend old and new
    this.predictionY =
      this.predictionY * (1 - this.smoothingFactor) +
      rawPrediction * this.smoothingFactor;

    this.lastUpdate = performance.now();
  }

  predictImpactY(gameState: GameState): number {
    const canvas = gameState.canvas;
    // Simple linear prediction with bounces
    const x0 = this.lastSeenBallX;
    const y0 = this.lastSeenBallY;
    const vx = this.lastSeenBallSpeedX;
    const vy = this.lastSeenBallSpeedY;

    const paddleX = canvas.width - 20; // AI paddle X

    // If ball is moving away from AI, fallback to just current Y
    if (vx <= 0) return y0;

    // Time to reach AI paddle's X coordinate
    const timeToPaddle = (paddleX - x0) / vx;

    // Predicted raw Y position before handling wall bounces
    let predictedY = y0 + vy * timeToPaddle;

    // Reflect within top/bottom bounds until inside field
    while (predictedY < 0 || predictedY > canvas.height) {
      if (predictedY < 0) {
        predictedY = -predictedY;
      } else if (predictedY > canvas.height) {
        predictedY = 2 * canvas.height - predictedY;
      }
    }

    // Add random prediction error (noise)
    const noise = (Math.random() * 2 - 1) * this.predictionError;
    return predictedY + noise;
  }

  decideMove(paddleY: number, paddleHeight: number): "up" | "down" | "none" {
    // Example: where the AI predicts the ball will hit its side
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
}
