// Key states
const keys: { [key: string]: boolean } = {};

export function setupInputListeners() {
	document.addEventListener("keydown", (event) => keys[event.key] = true);
	document.addEventListener("keyup", (event) => keys[event.key] = false);
}

export function updatePaddlePositions(canvas: HTMLCanvasElement, GameState: any) {
	if (keys["w"] && GameState.paddle1Y > 0) GameState.paddle1Y -= GameState.paddleSpeed;
	if (keys["s"] && GameState.paddle1Y < canvas.height - GameState.paddleHeight) GameState.paddle1Y += GameState.paddleSpeed;
	if (keys["ArrowUp"] && GameState.paddle2Y > 0) GameState.paddle2Y -= GameState.paddleSpeed;
	if (keys["ArrowDown"] && GameState.paddle2Y < canvas.height - GameState.paddleHeight) GameState.paddle2Y += GameState.paddleSpeed;
}
