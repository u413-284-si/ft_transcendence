import { GameState } from "./config.js";
import { canvas, ctx } from "./init.js";
import { drawStartScreen } from "./ui.js";

export function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (!GameState.gameStarted) {
		drawStartScreen(ctx, canvas);
		return;
	}

	drawBall();
	drawPaddles();
	drawScores();

	// Display winner message if game is over
	if (GameState.gameOver) {
		ctx.fillStyle = "yellow";
		ctx.font = "40px Arial";
		const winnerText = GameState.player1Score >= GameState.winningScore ? "Player 1 Wins!" : "Player 2 Wins!";
		ctx.fillText(winnerText, canvas.width / 2 - 100, canvas.height / 2);
		ctx.font = "20px Arial";
		ctx.fillText("Press ENTER to Restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
	}
}

function drawBall() {
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(GameState.ballX, GameState.ballY, 10, 0, Math.PI * 2);
	ctx.fill();
}

function drawPaddles() {
	ctx.fillStyle = "white";
	ctx.fillRect(10, GameState.paddle1Y, GameState.paddleWidth, GameState.paddleHeight);
	ctx.fillRect(canvas.width - 20, GameState.paddle2Y, GameState.paddleWidth, GameState.paddleHeight);
}

function drawScores() {
	ctx.fillStyle = "white";
	ctx.font = "30px Arial";

	// Player 1 name and score
	const player1Text = shortenName(GameState.player1 || "Player 1") + ":" + " " + GameState.player1Score.toString();
	ctx.fillText(player1Text, canvas.width / 4 - 80, 50);

	// Player 2 name and score
	const player2Text = shortenName(GameState.player2 || "Player 2") + ":" + " " + GameState.player2Score.toString();
	ctx.fillText(player2Text, (canvas.width * 3) / 4 - 80, 50);
}

function shortenName(name: string, maxLength: number = 10): string {
	return name.length > maxLength ? name.slice(0, maxLength) + "." : name;
}
