import { AIPlayer } from "../AIPlayer.js";
import { GameKey } from "../views/GameView.js";

export interface GameState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  winningScore: number;
  ballRadius: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  initialBallSpeed: number;
  paddleLeftX: number;
  paddleLeftY: number;
  paddleRightX: number;
  paddleRightY: number;
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number;
  gameOver: boolean;
  keys: Record<GameKey, boolean>;
  ai: AIPlayer;
}
