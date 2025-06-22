import { updatePaddlePositions } from "./input.js";
import { draw } from "./draw.js";
import { GameState } from "./types/IGameState.js";
import { GameKey } from "./views/GameView.js";
import { Tournament } from "./Tournament.js";
import { updateTournamentBracket } from "./services/tournamentService.js";
import { createMatch } from "./services/matchServices.js";
import { auth } from "./AuthManager.js";
import { GameType } from "./views/GameView.js";
import { AIPlayer } from "./AIPlayer.js";

let isAborted: boolean = false;

let gameState: GameState;
let lastTime: DOMHighResTimeStamp;

export function getIsAborted(): boolean {
  return isAborted;
}

export function setIsAborted(value: boolean) {
  isAborted = value;
}

export async function startGame(
  nickname1: string,
  nickname2: string,
  userRole: string | null,
  gameType: GameType,
  tournament: Tournament | null,
  keys: Record<GameKey, boolean>
) {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const ai = new AIPlayer();

  setIsAborted(false);
  gameState = initGameState(canvas, ctx, nickname1, nickname2, keys, ai);
  lastTime = performance.now();
  resetBall(gameState);
  gameState.ballSpeedX *= Math.random() < 0.5 ? -1 : 1;

  requestAnimationFrame(gameLoop);

  if (getIsAborted()) {
    return;
  }
  await endGame(gameState, tournament, userRole);
}

function initGameState(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  player1: string,
  player2: string,
  keys: Record<GameKey, boolean>,
  ai: AIPlayer
): GameState {
  return {
    canvas: canvas,
    ctx: ctx,
    player1: player1,
    player2: player2,
    player1Score: 0,
    player2Score: 0,
    winningScore: 5, // FIXME: needs to be a higher value
    ballRadius: 10,
    ballX: canvas.width / 2,
    ballY: canvas.height / 2,
    ballSpeedX: 200,
    ballSpeedY: 200,
    initialBallSpeed: 400,
    paddleLeftX: 10,
    paddleLeftY: canvas.height / 2 - 40,
    paddleRightX: canvas.width - 20,
    paddleRightY: canvas.height / 2 - 40,
    paddleHeight: 80,
    paddleWidth: 10,
    paddleSpeed: 300,
    gameOver: false,
    keys: keys,
    ai: ai
  };
}

function gameLoop(time: DOMHighResTimeStamp) {
  if (gameState.gameOver) {
    return;
  }

  const deltaTime = (time - lastTime) / 1000;

  update(gameState, deltaTime);
  draw(gameState);
  lastTime = time;

  requestAnimationFrame(gameLoop);
}

function update(gameState: GameState, deltaTime: DOMHighResTimeStamp) {
  if (gameState.gameOver) return;

  if (gameState.ai) {
    gameState.ai.updatePerception(gameState);

    const move = gameState.ai.decideMove(
      gameState.paddleRightY,
      gameState.paddleHeight
    );

    gameState.keys["ArrowUp"] = move === "up";
    gameState.keys["ArrowDown"] = move === "down";
  }

  updatePaddlePositions(gameState, deltaTime);

  // Move the ball
  gameState.ballX += gameState.ballSpeedX * deltaTime;
  gameState.ballY += gameState.ballSpeedY * deltaTime;

  let result = handlePaddleCollision(
    gameState.ballX,
    gameState.ballY,
    gameState.ballRadius,
    gameState.paddleLeftX,
    gameState.paddleLeftY,
    gameState.paddleWidth,
    gameState.paddleHeight,
    gameState.ballSpeedX,
    gameState.ballSpeedY
  );

  if (result) {
    gameState.ballX = result.newX;
    gameState.ballY = result.newY;
    gameState.ballSpeedX = result.newBallSpeedX;
    gameState.ballSpeedY = result.newBallSpeedY;
  }

  // Right paddle
  result = handlePaddleCollision(
    gameState.ballX,
    gameState.ballY,
    gameState.ballRadius,
    gameState.paddleRightX,
    gameState.paddleRightY,
    gameState.paddleWidth,
    gameState.paddleHeight,
    gameState.ballSpeedX,
    gameState.ballSpeedY
  );

  if (result) {
    gameState.ballX = result.newX;
    gameState.ballY = result.newY;
    gameState.ballSpeedX = result.newBallSpeedX;
    gameState.ballSpeedY = result.newBallSpeedY;
  }

  // Ball collision with top & bottom
  if (gameState.ballY <= 0 || gameState.ballY >= gameState.canvas.height)
    gameState.ballSpeedY *= -1;

  // Ball out of bounds (scoring)
  if (gameState.ballX <= 0) {
    gameState.player2Score++;
    checkWinner(gameState);
    resetBall(gameState);
    gameState.ai.reset();
  }

  if (gameState.ballX >= gameState.canvas.width) {
    gameState.player1Score++;
    checkWinner(gameState);
    resetBall(gameState);
    gameState.ai.reset();
  }
}

function resetBall(gameState: GameState) {
  gameState.ballX = gameState.canvas.width / 2;
  gameState.ballY = gameState.canvas.height / 2;

  const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8; // -22.5° to +22.5°

  const speed = gameState.initialBallSpeed;

  const direction = Math.sign(gameState.ballSpeedX) * -1; // flip direction

  gameState.ballSpeedX = direction * speed * Math.cos(angle);
  gameState.ballSpeedY = speed * Math.sin(angle);
}

function checkWinner(gameState: GameState) {
  if (
    gameState.player1Score >= gameState.winningScore ||
    gameState.player2Score >= gameState.winningScore
  ) {
    gameState.gameOver = true;
  }
}

async function endGame(
  gameState: GameState,
  tournament: Tournament | null,
  userRole: string | null
) {
  if (tournament) {
    const matchId = tournament.getNextMatchToPlay()!.matchId;
    const winner =
      gameState.player1Score > gameState.player2Score
        ? gameState.player1
        : gameState.player2;
    tournament.updateBracketWithResult(matchId, winner);
    await updateTournamentBracket(tournament);
  }

  await createMatch({
    tournament: tournament
      ? { id: tournament!.getId(), name: tournament!.getTournamentName() }
      : null,
    userId: userRole ? auth.getToken().id : null,
    playedAs: userRole,
    player1Nickname: gameState.player1,
    player2Nickname: gameState.player2,
    player1Score: gameState.player1Score,
    player2Score: gameState.player2Score
  });

  await waitForEnterKey();
}

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

export function handlePaddleCollision(
  ballX: number,
  ballY: number,
  ballRadius: number,
  paddleX: number,
  paddleY: number,
  paddleWidth: number,
  paddleHeight: number,
  ballSpeedX: number,
  ballSpeedY: number,
  speedUpFactor: number = 1.05
) {
  // Axis-Aligned Bounding Box check with radius
  const collided =
    ballX + ballRadius > paddleX &&
    ballX - ballRadius < paddleX + paddleWidth &&
    ballY + ballRadius > paddleY &&
    ballY - ballRadius < paddleY + paddleHeight;

  if (!collided) {
    return;
  }

  const originalSpeed = Math.hypot(ballSpeedX, ballSpeedY);

  // Compute offset: -1 (top edge) to +1 (bottom edge)
  const paddleCenter = paddleY + paddleHeight / 2;
  const offset = (ballY - paddleCenter) / (paddleHeight / 2);

  // Max bounce angle (in radians)
  const maxBounceAngle = Math.PI / 4; // 45 degrees

  const bounceAngle = offset * maxBounceAngle;

  // Apply speed boost
  const newSpeed = originalSpeed * speedUpFactor;

  // Determine direction: ball always bounces *away* from paddle
  const newDirection = ballSpeedX > 0 ? -1 : 1;

  ballSpeedX = newDirection * newSpeed * Math.cos(bounceAngle);
  ballSpeedY = newSpeed * Math.sin(bounceAngle);

  // Re-position: put the ball just outside the paddle edge to avoid sticking
  if (ballSpeedX > 0) {
    ballX = paddleX + paddleWidth + ballRadius;
  } else {
    ballX = paddleX - ballRadius;
  }

  return {
    newX: ballX,
    newY: ballY,
    newBallSpeedX: ballSpeedX,
    newBallSpeedY: ballSpeedY
  };
}
