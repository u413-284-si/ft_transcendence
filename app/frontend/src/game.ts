import { updatePaddlePositions, setupInputListeners } from "./input.js";
import { draw } from "./draw.js";
import { IGameState } from "./types/IGameState.js";

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
		const gameState = initGameState(canvas, nickname1, nickname2);
		startGame(canvas, ctx, gameState);
	}
}

function initGameState(canvas: HTMLCanvasElement, nickname1: string, nickname2: string): IGameState {
  return {
      player1: nickname1,
      player2: nickname2,
      player1Score: 0,
      player2Score: 0,
      winningScore: 3,
      ballX: canvas.width / 2,
      ballY: canvas.height / 2,
      ballSpeedX: 7,
      ballSpeedY: 7,
      paddle1Y: canvas.height / 2 - 40,
      paddle2Y: canvas.height / 2 - 40,
      paddleHeight: 80,
      paddleWidth: 10,
      paddleSpeed: 6,
      gameStarted: false,
      gameOver: false
  };
}

function startGame(canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D, gameState: IGameState) {
	gameState.gameOver = false;
	gameState.gameStarted = true;
	document.getElementById("register-form")?.remove();
	gameLoop(canvas, ctx, gameState);
}

function gameLoop(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: IGameState) {
	update(canvas, gameState);
	draw(canvas, ctx, gameState);
	requestAnimationFrame(() => gameLoop(canvas, ctx, gameState));
}

function update(canvas: HTMLCanvasElement, gameState: IGameState) {
	if (gameState.gameOver || !gameState.gameStarted) return;

	updatePaddlePositions(canvas, gameState);

	// Move the ball
	gameState.ballX += gameState.ballSpeedX;
	gameState.ballY += gameState.ballSpeedY;

	// Ball collision with top & bottom
	if (gameState.ballY <= 0 || gameState.ballY >= canvas.height)
		gameState.ballSpeedY *= -1;

	// Ball collision with paddles
	if (
		(gameState.ballX <= 20 && gameState.ballY >= gameState.paddle1Y
			&& gameState.ballY <= gameState.paddle1Y + gameState.paddleHeight) ||
		(gameState.ballX >= canvas.width - 20 && gameState.ballY >= gameState.paddle2Y
			&& gameState.ballY <= gameState.paddle2Y + gameState.paddleHeight)
	) {
		gameState.ballSpeedX *= -1; // Reverse ball direction
	}

	// Ball out of bounds (scoring)
	if (gameState.ballX <= 0) {
		gameState.player2Score++;
		checkWinner(gameState);
		resetBall(canvas, gameState);
	}

	if (gameState.ballX >= canvas.width) {
		gameState.player1Score++;
		checkWinner(gameState);
		resetBall(canvas, gameState);
	}
}

function resetBall(canvas: HTMLCanvasElement, gameState: IGameState) {
	gameState.ballX = canvas.width / 2;
	gameState.ballY = canvas.height / 2;
	gameState.ballSpeedX *= -1; // Change direction after scoring
}

function checkWinner(gameState: IGameState) {
	if (gameState.player1Score >= gameState.winningScore || gameState.player2Score >= gameState.winningScore) {
		gameState.gameOver = true;
	}
}
