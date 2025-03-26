import { GameState } from "./config.js";
import { updatePaddlePositions, setupInputListeners } from "./input.js";
import { draw } from "./draw.js";
import { Match } from "./types/match.js"
import NewGame from "./views/NewGame.js";

export function renderGame() {
	const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d")!;

	setupInputListeners();

	const nickname1: string = (document.getElementById("nickname1") as HTMLInputElement).value.trim();
	const nickname2: string = (document.getElementById("nickname2") as HTMLInputElement).value.trim();

	if (!nickname1 || !nickname2)
		return alert("Please enter a nickname for both players.");

	GameState.player1 = nickname1;
	GameState.player2 = nickname2;
	// const input = document.getElementById(`usernameInput${playerNum}`) as HTMLInputElement;

	startGame(canvas);
	gameLoop(canvas, ctx);
}

async function gameLoop(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	update(canvas);
	draw(canvas, ctx);
	if (GameState.gameOver)
		await endGame()
	else
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
	if (GameState.player1Score >= 3 || GameState.player2Score >= 3) {
		GameState.gameOver = true;
	}
}

async function endGame() {
	await saveMatch({
		playerId: 1,
		playerNickname: GameState.player1,
		opponentNickname: GameState.player2,
		playerScore: GameState.player1Score,
		opponentScore: GameState.player2Score
	});

	await waitForEnterKey();

	const newGameView = new NewGame();
	await newGameView.render();
}

async function saveMatch(matchData: Match) {
	try {
		const response = await fetch('http://localhost:4000/api/matches', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(matchData),
		});

		if (!response.ok) {
			throw new Error('Failed to save match');
		}

		const data = await response.json();
		console.log('Match saved:', data);
	} catch (error) {
		console.error('Error saving match:', error);
	}
};

function waitForEnterKey(): Promise<void> {
	return new Promise((resolve) => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Enter") {
				document.removeEventListener("keydown", onKeyDown);
				resolve();
			}
		}
		document.addEventListener("keydown", onKeyDown);
	});
}
