import { AIPlayer } from "../AIPlayer.js";
import { GameKey } from "../views/GameView.js";

export interface GameState {
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  winningScore: number;
  canvasHeight: number;
  canvasWidth: number;
  ballX: number;
  ballY: number;
  ballRadius: number; // pixel
  initialBallSpeed: number; // pixel/second
  ballSpeedX: number; // pixel/second
  ballSpeedY: number; // pixel/second
  paddle1X: number;
  paddle1Y: number;
  paddle2X: number;
  paddle2Y: number;
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number; // pixel/second
  gameOver: boolean;
  keys: Record<GameKey, boolean>;
  aiPlayer1: AIPlayer | null;
  aiPlayer2: AIPlayer | null;
  speedUpFactor: number;
  maxBounceAngle: number;
}

export type Snapshot = Pick<
  GameState,
  "ballX" | "ballY" | "paddle1Y" | "paddle2Y"
>;
