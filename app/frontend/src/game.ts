import { updatePaddlePositions } from "./input.js";
import { draw } from "./draw.js";
import { GameState } from "./types/IGameState.js";
import { GameKey } from "./views/GameView.js";
import { Tournament } from "./Tournament.js";
import { updateTournamentBracket } from "./services/tournamentService.js";
import { createMatch } from "./services/matchServices.js";
import { playedAs, PlayerType } from "./types/IMatch.js";
import { getDataOrThrow } from "./services/api.js";
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
  type1: PlayerType,
  type2: PlayerType,
  userRole: playedAs,
  tournament: Tournament | null,
  keys: Record<GameKey, boolean>
) {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  setIsAborted(false);

  let aiPlayer1: AIPlayer | null = null;
  let aiPlayer2: AIPlayer | null = null;
  if (type1 === "AI") {
    aiPlayer1 = new AIPlayer("left");
  }
  if (type2 === "AI") {
    aiPlayer2 = new AIPlayer("right");
  }
  gameState = initGameState(
    canvas,
    ctx,
    nickname1,
    nickname2,
    keys,
    aiPlayer1,
    aiPlayer2
  );
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
  aiPlayer1: AIPlayer | null,
  aiPlayer2: AIPlayer | null
): GameState {
  return {
    ctx: ctx,
    player1: player1,
    player2: player2,
    player1Score: 0,
    player2Score: 0,
    winningScore: 5, // FIXME: needs to be a higher value
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
    ballRadius: 10,
    ballX: canvas.width / 2,
    ballY: canvas.height / 2,
    ballSpeedX: 200,
    ballSpeedY: 200,
    initialBallSpeed: 400,
    paddle1X: 10,
    paddle1Y: canvas.height / 2 - 40,
    paddle2X: canvas.width - 20,
    paddle2Y: canvas.height / 2 - 40,
    paddleHeight: 80,
    paddleWidth: 10,
    paddleSpeed: 300,
    gameOver: false,
    keys: keys,
    aiPlayer1: aiPlayer1,
    aiPlayer2: aiPlayer2
  };
}

function gameLoop(timestamp: DOMHighResTimeStamp) {
  if (gameState.gameOver) {
    return;
  }

  const deltaTime = (timestamp - lastTime) / 1000;

  update(gameState, deltaTime);
  draw(gameState);
  lastTime = timestamp;

  requestAnimationFrame(gameLoop);
}

function update(gameState: GameState, deltaTime: DOMHighResTimeStamp) {
  if (gameState.gameOver) return;

  if (gameState.aiPlayer1) {
    gameState.aiPlayer1.updatePerception(gameState);

    const move = gameState.aiPlayer1.decideMove(
      gameState.paddle1Y,
      gameState.paddleHeight
    );

    gameState.keys["w"] = move === "up";
    gameState.keys["s"] = move === "down";
  }

  if (gameState.aiPlayer2) {
    gameState.aiPlayer2.updatePerception(gameState);

    const move = gameState.aiPlayer2.decideMove(
      gameState.paddle2Y,
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
    gameState.paddle1X,
    gameState.paddle1Y,
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
    gameState.paddle2X,
    gameState.paddle2Y,
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
  if (gameState.ballY <= 0 || gameState.ballY >= gameState.canvasHeight)
    gameState.ballSpeedY *= -1;

  // Ball out of bounds (scoring)
  if (gameState.ballX <= 0) {
    gameState.player2Score++;
    checkWinner(gameState);
    resetBall(gameState);
    if (gameState.aiPlayer1) {
      gameState.aiPlayer1.reset();
    }
    if (gameState.aiPlayer2) {
      gameState.aiPlayer2.reset();
    }
  }

  if (gameState.ballX >= gameState.canvasWidth) {
    gameState.player1Score++;
    checkWinner(gameState);
    resetBall(gameState);
    if (gameState.aiPlayer1) {
      gameState.aiPlayer1.reset();
    }
    if (gameState.aiPlayer2) {
      gameState.aiPlayer2.reset();
    }
  }
}

function resetBall(gameState: GameState) {
  gameState.ballX = gameState.canvasWidth / 2;
  gameState.ballY = gameState.canvasHeight / 2;

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
  userRole: playedAs
) {
  if (tournament) {
    const matchId = tournament.getNextMatchToPlay()!.matchId;
    const winner =
      gameState.player1Score > gameState.player2Score
        ? gameState.player1
        : gameState.player2;
    tournament.updateBracketWithResult(matchId, winner);
    getDataOrThrow(await updateTournamentBracket(tournament));
  }

  getDataOrThrow(
    await createMatch({
      playedAs: userRole,
      player1Nickname: gameState.player1,
      player2Nickname: gameState.player2,
      player1Score: gameState.player1Score,
      player2Score: gameState.player2Score,
      player1Type: gameState.aiPlayer1 ? "AI" : "HUMAN",
      player2Type: gameState.aiPlayer2 ? "AI" : "HUMAN",
      tournament: tournament
        ? { id: tournament!.getId(), name: tournament!.getTournamentName() }
        : null
    })
  );

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
