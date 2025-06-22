import { GameState } from "./types/IGameState";

export class AIPlayer {
  private lastSeenBallX: number;
  private lastSeenBallY: number;
  private lastSeenBallSpeedX: number;
  private lastSeenBallSpeedY: number;
  private predictionY: number;
  private lastUpdate: number;

  private reactionInterval: number;
  private predictionError: number;
  maxPaddleSpeed: number;
  private tolerance: number;
  private smoothingFactor: number;

  constructor(
    options: {
      reactionInterval?: number;
      predictionError?: number;
      maxPaddleSpeed?: number;
      tolerance?: number;
      smoothingFactor?: number;
    } = {}
  ) {
    this.lastSeenBallX = 0;
    this.lastSeenBallY = 0;
    this.lastSeenBallSpeedX = 0;
    this.lastSeenBallSpeedY = 0;
    this.predictionY = 0;
    this.lastUpdate = performance.now();

    this.reactionInterval = options.reactionInterval ?? 1000;
    this.predictionError = options.predictionError ?? 10;
    this.maxPaddleSpeed = options.maxPaddleSpeed ?? 300;
    this.tolerance = options.tolerance ?? 10;
    this.smoothingFactor = options.smoothingFactor ?? 0.1;
  }

  updatePerception(gameState: GameState) {
    const now = performance.now();
    if (now - this.lastUpdate < this.reactionInterval) {
      return; // skip this update
    }
    this.lastSeenBallX = gameState.ballX;
    this.lastSeenBallY = gameState.ballY;
    this.lastSeenBallSpeedX = gameState.ballSpeedX;
    this.lastSeenBallSpeedY = gameState.ballSpeedY;

    // update for right or left ai
    const paddleX = gameState.paddleRightX;
    const rawPrediction = this.predictImpactY(gameState, paddleX);

    // Smooth it: blend old and new
    this.predictionY =
      this.predictionY * (1 - this.smoothingFactor) +
      rawPrediction * this.smoothingFactor;

    this.lastUpdate = performance.now();
  }

  predictImpactY(gameState: GameState, paddleX: number): number {
    const { canvas } = gameState;
    // Simple linear prediction with bounces
    const x0 = this.lastSeenBallX;
    const y0 = this.lastSeenBallY;
    const vx = this.lastSeenBallSpeedX;
    const vy = this.lastSeenBallSpeedY;

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
