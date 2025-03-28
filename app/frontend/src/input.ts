import { IGameState } from "./IGameState.js";

// Key states
const keys: { [key: string]: boolean } = {};

export function setupInputListeners() {
	document.addEventListener("keydown", (event) => keys[event.key] = true);
	document.addEventListener("keyup", (event) => keys[event.key] = false);
}

export function updatePaddlePositions(canvas: HTMLCanvasElement, gameState: IGameState) {
	if (keys["w"] && gameState.paddle1Y > 0) gameState.paddle1Y -= gameState.paddleSpeed;
	if (keys["s"] && gameState.paddle1Y < canvas.height - gameState.paddleHeight) gameState.paddle1Y += gameState.paddleSpeed;
	if (keys["ArrowUp"] && gameState.paddle2Y > 0) gameState.paddle2Y -= gameState.paddleSpeed;
	if (keys["ArrowDown"] && gameState.paddle2Y < canvas.height - gameState.paddleHeight) gameState.paddle2Y += gameState.paddleSpeed;
}
