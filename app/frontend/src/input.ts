import { GameState } from "./types/IGameState.js";

export function updatePaddlePositions(gameState: GameState) {
  if (gameState.keys["w"] && gameState.paddle1Y > 0)
    gameState.paddle1Y -= gameState.paddleSpeed;
  if (
    gameState.keys["s"] &&
    gameState.paddle1Y < gameState.canvasHeight - gameState.paddleHeight
  )
    gameState.paddle1Y += gameState.paddleSpeed;
  if (gameState.keys["ArrowUp"] && gameState.paddle2Y > 0)
    gameState.paddle2Y -= gameState.paddleSpeed;
  if (
    gameState.keys["ArrowDown"] &&
    gameState.paddle2Y < gameState.canvasHeight - gameState.paddleHeight
  )
    gameState.paddle2Y += gameState.paddleSpeed;
}
