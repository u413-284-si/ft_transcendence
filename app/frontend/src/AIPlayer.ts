import { GameState } from "./types/IGameState";

export class AIPlayer {
  lastSeenBallX: number;
  lastSeenBallY: number;
  lastSeenBallSpeedX: number;
  lastSeenBallSpeedY: number;
  predictionY: number;
  lastUpdate: number;
  reactionInterval: number;

  constructor(reactionInterval = 1000) {
    this.lastSeenBallX = 0;
    this.lastSeenBallY = 0;
    this.lastSeenBallSpeedX = 0;
    this.lastSeenBallSpeedY = 0;
    this.predictionY = 0;
    this.lastUpdate = performance.now();
    this.reactionInterval = reactionInterval;
  }

  updatePerception(gameState: GameState) {
    this.lastSeenBallX = gameState.ballX;
    this.lastSeenBallY = gameState.ballY;
    this.lastSeenBallSpeedX = gameState.ballSpeedX;
    this.lastSeenBallSpeedY = gameState.ballSpeedY;

    this.predictionY = this.predictImpactY(gameState);
    this.lastUpdate = performance.now();
  }

  predictImpactY(gameState: GameState): number {
    const canvas = gameState.canvas;
    // Simple linear prediction with bounces
    let x = this.lastSeenBallX;
    let y = this.lastSeenBallY;
    const vx = this.lastSeenBallSpeedX;
    let vy = this.lastSeenBallSpeedY;

    const paddleX = canvas.width - 20; // AI paddle X

    while (vx > 0 && x < paddleX) {
      x += vx;
      y += vy;

      if (y <= 0 || y >= canvas.height) {
        vy *= -1;
      }
    }

    return y;
  }

  decideMove(paddleY: number, paddleHeight: number): "up" | "down" | "none" {
    const paddleCenter = paddleY + paddleHeight / 2;

    if (paddleCenter < this.predictionY - 10) {
      return "down";
    } else if (paddleCenter > this.predictionY + 10) {
      return "up";
    } else {
      return "none";
    }
  }
}
