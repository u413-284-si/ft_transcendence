import { AIPlayer } from "../AIPlayer.js";
import { GameKey } from "../views/GameView.js";

export interface GameState {
  ctx: CanvasRenderingContext2D;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  winningScore: number;
  canvasHeight: number;
  canvasWidth: number;
  ballX: number;
  ballY: number;
  ballRadius: number;
  initialBallSpeed: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1X: number;
  paddle1Y: number;
  paddle2X: number;
  paddle2Y: number;
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number;
  gameOver: boolean;
  keys: Record<GameKey, boolean>;
  aiPlayer1: AIPlayer | null;
  aiPlayer2: AIPlayer | null;
  lastTimestamp: DOMHighResTimeStamp;
  speedUpFactor: number;
  maxBounceAngle: number;
}
