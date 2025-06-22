import { GameState } from "./types/IGameState.js";

export function updatePaddlePositions(
  gameState: GameState,
  deltaTime: DOMHighResTimeStamp
) {
  const canvas = gameState.canvas;

  if (gameState.keys["w"] && gameState.paddleLeftY > 0)
    gameState.paddleLeftY -= gameState.paddleSpeed * deltaTime;
  if (
    gameState.keys["s"] &&
    gameState.paddleLeftY < canvas.height - gameState.paddleHeight
  )
    gameState.paddleLeftY += gameState.paddleSpeed * deltaTime;
  if (gameState.keys["ArrowUp"] && gameState.paddleRightY > 0)
    gameState.paddleRightY -= gameState.ai.maxPaddleSpeed * deltaTime;
  if (
    gameState.keys["ArrowDown"] &&
    gameState.paddleRightY < canvas.height - gameState.paddleHeight
  )
    gameState.paddleRightY += gameState.ai.maxPaddleSpeed * deltaTime;
}
