import { GameKey } from "../views/GameView.js";

export interface GameState {
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  winningScore: number;
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1Y: number;
  paddle2Y: number;
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number;
  gameOver: boolean;
  keys: Record<GameKey, boolean>;
}
