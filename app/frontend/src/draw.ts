import { GameState } from "./types/IGameState.js";

export function draw(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

  drawScores(ctx, gameState);
  if (gameState.gameOver) {
    drawWinningScreen(ctx, gameState);
    return;
  }
  drawBall(ctx, gameState);
  drawPaddles(ctx, gameState);
}

function drawBall(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddles(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = "white";
  ctx.fillRect(
    gameState.paddle1X,
    gameState.paddle1Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
  ctx.fillRect(
    gameState.paddle2X,
    gameState.paddle2Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
}

function drawScores(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";

  // Player 1 name and score
  const player1Text =
    shortenName(gameState.player1 || i18next.t("global.player") + "1") +
    ":" +
    " " +
    gameState.player1Score.toString();
  ctx.fillText(player1Text, gameState.canvasWidth / 4 - 80, 50);

  // Player 2 name and score
  const player2Text =
    shortenName(gameState.player2 || i18next.t("global.player") + "2") +
    ":" +
    " " +
    gameState.player2Score.toString();
  ctx.fillText(player2Text, (gameState.canvasWidth * 3) / 4 - 80, 50);
}

function shortenName(name: string, maxLength: number = 10): string {
  return name.length > maxLength ? name.slice(0, maxLength) + "." : name;
}

function drawWinningScreen(
  ctx: CanvasRenderingContext2D,
  gameState: GameState
) {
  ctx.fillStyle = "yellow";
  ctx.font = "40px Arial";
  const canvasCenterX = gameState.canvasWidth / 2;
  const canvasCenterY = gameState.canvasHeight / 2;
  const winnerText =
    gameState.player1Score >= gameState.winningScore
      ? i18next.t("global.playerWins", { player: gameState.player1 })
      : i18next.t("global.playerWins", { player: gameState.player2 });
  ctx.fillText(winnerText, canvasCenterX - 100, canvasCenterY);
  ctx.font = "20px Arial";
  ctx.fillText(
    i18next.t("global.continue"),
    canvasCenterX - 100,
    canvasCenterY / 2 + 40
  );
}
