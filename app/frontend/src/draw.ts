import { IGameState } from "./IGameState.js";

export function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: IGameState) {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawBall(ctx, gameState);
	drawPaddles(canvas, ctx, gameState);
	drawScores(canvas, ctx, gameState);

	// Display winner message if game is over
	if (gameState.gameOver) {
		ctx.fillStyle = "yellow";
		ctx.font = "40px Arial";
		const winnerText = gameState.player1Score >= gameState.winningScore ? "Player 1 Wins!" : "Player 2 Wins!";
		ctx.fillText(winnerText, canvas.width / 2 - 100, canvas.height / 2);
	}
}

function drawBall(ctx: CanvasRenderingContext2D, gameState: IGameState) {
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
	ctx.fill();
}

function drawPaddles(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: IGameState) {
	ctx.fillStyle = "white";
	ctx.fillRect(10, gameState.paddle1Y, gameState.paddleWidth, gameState.paddleHeight);
	ctx.fillRect(canvas.width - 20, gameState.paddle2Y, gameState.paddleWidth, gameState.paddleHeight);
}

function drawScores(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: IGameState) {
	ctx.fillStyle = "white";
	ctx.font = "30px Arial";

	// Player 1 name and score
	const player1Text = shortenName(gameState.player1 || "Player 1") + ":" + " " + gameState.player1Score.toString();
	ctx.fillText(player1Text, canvas.width / 4 - 80, 50);

	// Player 2 name and score
	const player2Text = shortenName(gameState.player2 || "Player 2") + ":" + " " + gameState.player2Score.toString();
	ctx.fillText(player2Text, (canvas.width * 3) / 4 - 80, 50);
}

function shortenName(name: string, maxLength: number = 10): string {
	return name.length > maxLength ? name.slice(0, maxLength) + "." : name;
}
