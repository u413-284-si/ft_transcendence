import { GameState, Snapshot } from "./types/IGameState.js";

export function draw(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  interpolated: Snapshot
) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

  drawScores(ctx, gameState);
  if (gameState.gameOver) {
    drawWinningScreen(ctx, gameState);
    return;
  }
  drawBall(ctx, gameState, interpolated);
  drawPaddles(ctx, gameState, interpolated);
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  interp: Snapshot
) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(interp.ballX, interp.ballY, gameState.ballRadius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddles(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  interp: Snapshot
) {
  ctx.fillStyle = "white";
  ctx.fillRect(
    gameState.paddle1X,
    interp.paddle1Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
  ctx.fillRect(
    gameState.paddle2X,
    interp.paddle2Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
}

function drawScores(ctx: CanvasRenderingContext2D, gameState: GameState) {
  ctx.fillStyle = "white";
  ctx.font = "30px Orbitron";

  const marginNames = 100;
  const marginScores = 30;
  const verticalOffset = 50;
  const centerX = gameState.canvasWidth / 2;

  const player1Text = shortenName(
    gameState.player1 || i18next.t("global.player") + "1"
  );
  ctx.fillText(player1Text, marginNames, verticalOffset);

  const player2Text = shortenName(
    gameState.player2 || i18next.t("global.player") + "2"
  );
  const p2Width = ctx.measureText(player2Text).width;
  ctx.fillText(
    player2Text,
    gameState.canvasWidth - marginNames - p2Width,
    verticalOffset
  );

  const p1score = gameState.player1Score.toString();
  const p1ScoreWidth = ctx.measureText(p1score).width;
  ctx.fillText(p1score, centerX - marginScores - p1ScoreWidth, verticalOffset);

  const scoreSeparator = "|";
  const separatorWidth = ctx.measureText(scoreSeparator).width;
  ctx.fillText(scoreSeparator, centerX - separatorWidth / 2, verticalOffset);

  const p2score = gameState.player2Score.toString();
  ctx.fillText(p2score, centerX + marginScores, verticalOffset);
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
    canvasCenterY + 40
  );
}

function interpolateSnapshot(
  from: Snapshot,
  to: GameState,
  alpha: number
): Snapshot {
  return {
    ballX: from.ballX * (1 - alpha) + to.ballX * alpha,
    ballY: from.ballY * (1 - alpha) + to.ballY * alpha,
    paddle1Y: from.paddle1Y * (1 - alpha) + to.paddle1Y * alpha,
    paddle2Y: from.paddle2Y * (1 - alpha) + to.paddle2Y * alpha
  };
}

export function render(
  gameState: GameState,
  snapshot: Snapshot,
  alpha: number,
  ctx: CanvasRenderingContext2D
) {
  const interpolated = interpolateSnapshot(snapshot, gameState, alpha);
  draw(ctx, gameState, interpolated);
}
