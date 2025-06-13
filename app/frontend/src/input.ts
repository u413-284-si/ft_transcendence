import { GameState } from "./types/IGameState.js";

export function updatePaddlePositions(
  gameState: GameState,
  deltaTime: DOMHighResTimeStamp
) {
  const canvas = gameState.canvas;

  if (gameState.keys["w"] && gameState.paddle1Y > 0)
    gameState.paddle1Y -= gameState.paddleSpeed * deltaTime;
  if (
    gameState.keys["s"] &&
    gameState.paddle1Y < canvas.height - gameState.paddleHeight
  )
    gameState.paddle1Y += gameState.paddleSpeed * deltaTime;
  if (gameState.keys["ArrowUp"] && gameState.paddle2Y > 0)
    gameState.paddle2Y -= gameState.paddleSpeed * deltaTime;
  if (
    gameState.keys["ArrowDown"] &&
    gameState.paddle2Y < canvas.height - gameState.paddleHeight
  )
    gameState.paddle2Y += gameState.paddleSpeed * deltaTime;
}
