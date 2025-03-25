import { GameState } from "./config.js";
import { updatePaddlePositions, setupInputListeners } from "./input.js";
import { draw } from "./draw.js";

export function renderGame(event: Event) {
	const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d")!;

	setupInputListeners();

	const nickname1: string = (document.getElementById("nickname1") as HTMLInputElement).value.trim();
	const nickname2: string = (document.getElementById("nickname2") as HTMLInputElement).value.trim();

	if (!nickname1 || !nickname2) {
		event.preventDefault();
		alert("Please enter a nickname for both players.");
	}
	else if (nickname1 === nickname2) {
		event.preventDefault();
		alert("Nicknames must be different.");
	}
	else {
		GameState.player1 = nickname1;
		GameState.player2 = nickname2;

		startGame(canvas);
		gameLoop(canvas, ctx);
	}
}

function gameLoop(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	update(canvas);
	draw(canvas, ctx);
	requestAnimationFrame(() => gameLoop(canvas, ctx));
}

export function startGame(canvas: HTMLCanvasElement) {
	GameState.gameOver = false;
	GameState.gameStarted = true;
	GameState.initialize(canvas.width, canvas.height);

	resetGame(canvas);
	document.getElementById("register-form")?.remove();
}

function resetGame(canvas: HTMLCanvasElement) {
	GameState.player1Score = 0;
	GameState.player2Score = 0;
	resetBall(canvas);
}

function resetBall(canvas: HTMLCanvasElement) {
	GameState.ballX = canvas.width / 2;
	GameState.ballY = canvas.height / 2;
	GameState.ballSpeedX *= -1; // Change direction after scoring
}

export function update(canvas: HTMLCanvasElement) {
	if (GameState.gameOver || !GameState.gameStarted) return;

	updatePaddlePositions(canvas);

	// Move the ball
	GameState.ballX += GameState.ballSpeedX;
	GameState.ballY += GameState.ballSpeedY;

	// Ball collision with top & bottom
	if (GameState.ballY <= 0 || GameState.ballY >= canvas.height)
		GameState.ballSpeedY *= -1;

	// Ball collision with paddles
	if (
		(GameState.ballX <= 20 && GameState.ballY >= GameState.paddle1Y
			&& GameState.ballY <= GameState.paddle1Y + GameState.paddleHeight) ||
		(GameState.ballX >= canvas.width - 20 && GameState.ballY >= GameState.paddle2Y
			&& GameState.ballY <= GameState.paddle2Y + GameState.paddleHeight)
	) {
		GameState.ballSpeedX *= -1; // Reverse ball direction
	}

	// Ball out of bounds (scoring)
	if (GameState.ballX <= 0) {
		GameState.player2Score++;
		checkWinner();
		resetBall(canvas);
	}

	if (GameState.ballX >= canvas.width) {
		GameState.player1Score++;
		checkWinner();
		resetBall(canvas);
	}
}

function checkWinner() {
	if (GameState.player1Score >= 10 || GameState.player2Score >= 10) {
		GameState.gameOver = true;
	}
}
