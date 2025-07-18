import { GameState } from "./types/IGameState.js";

export function draw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gameState: GameState
) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawScores(canvas, ctx, gameState);
  if (gameState.gameOver) {
    drawWinningScreen(canvas, ctx, gameState);
    return;
  }
  drawBall(ctx, gameState);
  drawPaddles(canvas, ctx, gameState);
}

function drawBall(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddles(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gameState: GameState
) {
  ctx.fillStyle = "white";
  ctx.fillRect(
    10,
    gameState.paddle1Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
  ctx.fillRect(
    canvas.width - 20,
    gameState.paddle2Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
}

function drawScores(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gameState: GameState
) {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";

  // Player 1 name and score
  const player1Text =
    shortenName(gameState.player1 || i18next.t("global.playerText") + "1") +
    ":" +
    " " +
    gameState.player1Score.toString();
  ctx.fillText(player1Text, canvas.width / 4 - 80, 50);

  // Player 2 name and score
  const player2Text =
    shortenName(gameState.player2 || i18next.t("global.playerText") + "2") +
    ":" +
    " " +
    gameState.player2Score.toString();
  ctx.fillText(player2Text, (canvas.width * 3) / 4 - 80, 50);
}

function shortenName(name: string, maxLength: number = 10): string {
  return name.length > maxLength ? name.slice(0, maxLength) + "." : name;
}

function drawWinningScreen(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gameState: GameState
) {
  ctx.fillStyle = "yellow";
  ctx.font = "40px Arial";
  const winnerText =
    gameState.player1Score >= gameState.winningScore
      ? i18next.t("global.playerWinsText", { player: gameState.player1 })
      : i18next.t("global.playerWinsText", { player: gameState.player2 });
  ctx.fillText(winnerText, canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = "20px Arial";
  ctx.fillText(
    i18next.t("global.continueText"),
    canvas.width / 2 - 100,
    canvas.height / 2 + 40
  );
}
