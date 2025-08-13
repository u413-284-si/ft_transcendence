import { GameState } from "./types/IGameState.js";

export function draw(gameState: GameState) {
  const canvas = gameState.canvas;
  const ctx = gameState.ctx;

  gameState.ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawScores(canvas, ctx, gameState);
  if (gameState.gameOver) {
    drawWinningScreen(canvas, ctx, gameState);
    return;
  }
  drawBall(gameState);
  drawPaddles(gameState);
}

function drawBall(gameState: GameState) {
  const ctx = gameState.ctx;

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    gameState.ballX,
    gameState.ballY,
    gameState.ballRadius,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawPaddles(gameState: GameState) {
  const ctx = gameState.ctx;

  ctx.fillStyle = "white";
  ctx.fillRect(
    gameState.paddleLeftX,
    gameState.paddleLeftY,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
  ctx.fillRect(
    gameState.paddleRightX,
    gameState.paddleRightY,
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
    shortenName(gameState.player1 || i18next.t("global.player") + "1") +
    ":" +
    " " +
    gameState.player1Score.toString();
  ctx.fillText(player1Text, canvas.width / 4 - 80, 50);

  // Player 2 name and score
  const player2Text =
    shortenName(gameState.player2 || i18next.t("global.player") + "2") +
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
      ? i18next.t("global.playerWins", { player: gameState.player1 })
      : i18next.t("global.playerWins", { player: gameState.player2 });
  ctx.fillText(winnerText, canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = "20px Arial";
  ctx.fillText(
    i18next.t("global.continue"),
    canvas.width / 2 - 100,
    canvas.height / 2 + 40
  );
}
