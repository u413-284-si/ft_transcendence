import { GameState } from "./config.js";
import { updatePaddlePositions, setupInputListeners } from "./input.js";
import { canvas } from "./init.js";
import { draw } from "./draw.js";

export function renderGame() {

	setupInputListeners();

	const nickname1: string = (document.getElementById("nickname1") as HTMLInputElement).value.trim();
	const nickname2: string = (document.getElementById("nickname2") as HTMLInputElement).value.trim();

	if (!nickname1 || !nickname2)
		return alert("Please enter a nickname for both players.");

	GameState.player1 = nickname1;
	GameState.player2 = nickname2;
	// const input = document.getElementById(`usernameInput${playerNum}`) as HTMLInputElement;

	startGame();
	gameLoop();
}

function gameLoop() {
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

export function startGame() {
	GameState.gameOver = false;
	GameState.gameStarted = true;
	resetGame();
	document.getElementById("register-form")?.remove();
}

function resetGame() {
	GameState.player1Score = 0;
	GameState.player2Score = 0;
	resetBall();
}

function resetBall() {
	GameState.ballX = canvas.width / 2;
	GameState.ballY = canvas.height / 2;
	GameState.ballSpeedX *= -1; // Change direction after scoring
}

export function update() {
	if (GameState.gameOver || !GameState.gameStarted) return;

	updatePaddlePositions();

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
		resetBall();
	}

	if (GameState.ballX >= canvas.width) {
		GameState.player1Score++;
		checkWinner();
		resetBall();
	}
}

function checkWinner() {
	if (GameState.player1Score >= 10 || GameState.player2Score >= 10) {
		GameState.gameOver = true;
	}
}
