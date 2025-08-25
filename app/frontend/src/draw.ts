import { GameState, Snapshot } from "./types/IGameState.js";
import { getCSSColorWithAlpha, getCSSVar } from "./utility.js";
import type { Point } from "./types/IGameState.js";

const trail: Point[] = [];

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
  drawBallWithTrail(ctx, gameState, interpolated);
  drawPaddles(ctx, gameState, interpolated);
}

function drawBallWithTrail(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  interp: Snapshot
) {
  const maxTrailLength = 15;

  if (!gameState.ballJustReset) {
    trail.push({ x: interp.ballX, y: interp.ballY });
    if (trail.length > maxTrailLength) trail.shift();
  } else {
    gameState.ballJustReset = false;
  }

  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const baseColor =
    gameState.ballSpeedX <= 0 ? "--color-neon-yellow" : "--color-neon-cyan";

  trail.forEach((pos, i) => {
    ctx.fillStyle = getCSSColorWithAlpha(baseColor, i / trail.length / 2);
    ctx.shadowColor = getCSSColorWithAlpha(baseColor, i / trail.length / 2);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, gameState.ballRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawPaddles(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  interp: Snapshot
) {
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = getCSSVar("--color-neon-cyan");
  ctx.shadowColor = getCSSVar("--color-neon-cyan");
  ctx.fillRect(
    gameState.paddle1X,
    interp.paddle1Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );

  ctx.fillStyle = getCSSVar("--color-neon-yellow");
  ctx.shadowColor = getCSSVar("--color-neon-yellow");
  ctx.fillRect(
    gameState.paddle2X,
    interp.paddle2Y,
    gameState.paddleWidth,
    gameState.paddleHeight
  );
  ctx.restore();
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
  ctx.fillStyle = getCSSVar("--color-neon-yellow");
  ctx.shadowColor = getCSSVar("--color-neon-yellow");
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.font = "40px Orbitron";

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

export function clearBallTrail() {
  trail.length = 0;
}
