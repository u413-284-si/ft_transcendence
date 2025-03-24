import { updatePaddlePositions, setupInputListeners } from "./input.js";
import { draw } from "./draw.js";

export function renderGame() {
	const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d")!;

	setupInputListeners();

	const nickname1: string = (document.getElementById("nickname1") as HTMLInputElement).value.trim();
	const nickname2: string = (document.getElementById("nickname2") as HTMLInputElement).value.trim();

	if (!nickname1 || !nickname2)
		return alert("Please enter a nickname for both players.");

	const GameState = {
		player1: nickname1,
		player2: nickname2,
		player1Score: 0,
		player2Score: 0,
		winningScore: 5,
		ballX: canvas.width / 2,
		ballY: canvas.height / 2,
		ballSpeedX: 4,
		ballSpeedY: 4,
		paddle1Y: canvas.height / 2 - 40,
		paddle2Y: canvas.height / 2 - 40,
		paddleHeight: 80,
		paddleWidth: 10,
		paddleSpeed: 6,
		gameStarted: false,
		gameOver: false
	};

	startGame(canvas, GameState);
	gameLoop(canvas, ctx, GameState);
}

function gameLoop(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, GameState: any) {
	update(canvas, GameState);
	draw(canvas, ctx, GameState);
	requestAnimationFrame(() => gameLoop(canvas, ctx, GameState));
}

function startGame(canvas: HTMLCanvasElement, GameState: any) {
	GameState.gameOver = false;
	GameState.gameStarted = true;
	document.getElementById("register-form")?.remove();
}

function resetBall(canvas: HTMLCanvasElement, GameState: any) {
	GameState.ballX = canvas.width / 2;
	GameState.ballY = canvas.height / 2;
	GameState.ballSpeedX *= -1; // Change direction after scoring
}

export function update(canvas: HTMLCanvasElement, GameState: any) {
	if (GameState.gameOver || !GameState.gameStarted) return;

	updatePaddlePositions(canvas, GameState);

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
		checkWinner(GameState);
		resetBall(canvas, GameState);
	}

	if (GameState.ballX >= canvas.width) {
		GameState.player1Score++;
		checkWinner(GameState);
		resetBall(canvas, GameState);
	}
}

function checkWinner(GameState: any) {
	if (GameState.player1Score >= GameState.winningScore || GameState.player2Score >= GameState.winningScore) {
		GameState.gameOver = true;
	}
}
