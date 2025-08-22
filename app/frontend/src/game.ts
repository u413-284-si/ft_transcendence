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
  const gameState = initGameState(
    canvas,
    nickname1,
    nickname2,
    keys,
    aiPlayer1,
    aiPlayer2
  );

  await runGameLoop(gameState, ctx);

  if (getIsAborted()) {
    return;
  }

  await endGame(gameState, tournament, userRole);
}

function initGameState(
  canvas: HTMLCanvasElement,
  player1: string,
  player2: string,
  keys: Record<GameKey, boolean>,
  aiPlayer1: AIPlayer | null,
  aiPlayer2: AIPlayer | null
): GameState {
  return {
    player1: player1,
    player2: player2,
    player1Score: 0,
    player2Score: 0,
    winningScore: 1, // FIXME: needs to be a higher value
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
    ballX: canvas.width / 2,
    ballY: canvas.height / 2,
    ballRadius: 10,
    ballSpeedX: 400,
    ballSpeedY: 400,
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
    aiPlayer2: aiPlayer2,
    lastTimestamp: performance.now()
  };
}

function runGameLoop(
  gameState: GameState,
  ctx: CanvasRenderingContext2D
): Promise<GameState> {
  return new Promise((resolve) => {
    function gameLoop(timestamp: number) {
      if (getIsAborted() || gameState.gameOver) {
        resolve(gameState);
        return;
      }

      let deltaTime = (timestamp - gameState.lastTimestamp) / 1000;

      if (deltaTime <= 0) {
        requestAnimationFrame(gameLoop);
        return;
      }

      deltaTime = Math.min(deltaTime, 0.1);
      const fps = calculateFPS(deltaTime);
      console.log(`FPS: ${fps}`);

      update(gameState, deltaTime);
      draw(gameState);
      gameState.lastTimestamp = timestamp;

      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  });
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
  updateBallPosition(gameState, deltaTime);

  handlePaddleCollision(gameState, "paddle1");
  handlePaddleCollision(gameState, "paddle2");

  handleWallCollision(gameState);
  handleOutOfBounds(gameState);
}

function resetBall(gameState: GameState) {
  gameState.ballX = gameState.canvasWidth / 2;
  gameState.ballY = gameState.canvasHeight / 2;
  gameState.ballSpeedX *= -1; // Change direction after scoring
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

function handlePaddleCollision(
  gameState: GameState,
  paddle: "paddle1" | "paddle2"
) {
  const { ballX, ballY, ballRadius, paddleHeight, paddleWidth } = gameState;

  const paddleX =
    paddle === "paddle1" ? gameState.paddle1X : gameState.paddle2X;
  const paddleY =
    paddle === "paddle1" ? gameState.paddle1Y : gameState.paddle2Y;

  const collided =
    ballX + ballRadius > paddleX &&
    ballX - ballRadius < paddleX + paddleWidth &&
    ballY + ballRadius > paddleY &&
    ballY - ballRadius < paddleY + paddleHeight;

  if (!collided) {
    return;
  }

  gameState.ballSpeedX *= -1;

  gameState.ballX =
    gameState.ballSpeedX > 0
      ? paddleX + paddleWidth + ballRadius
      : paddleX - ballRadius;
}

function handleWallCollision(gameState: GameState) {
  const { ballY, ballRadius, canvasHeight } = gameState;

  if (ballY - ballRadius <= 0) {
    gameState.ballY = ballRadius;
    gameState.ballSpeedY *= -1;
  }

  if (ballY + ballRadius >= canvasHeight) {
    gameState.ballY = canvasHeight - ballRadius;
    gameState.ballSpeedY *= -1;
  }
}

function resetAI(gameState: GameState) {
  if (gameState.aiPlayer1) gameState.aiPlayer1.reset();
  if (gameState.aiPlayer2) gameState.aiPlayer2.reset();
}

function handleOutOfBounds(gameState: GameState) {
  const { ballX, ballRadius, canvasWidth } = gameState;

  const checkScore = (condition: boolean, scoringPlayer: 1 | 2) => {
    if (!condition) return;

    if (scoringPlayer === 1) gameState.player1Score++;
    else gameState.player2Score++;

    checkWinner(gameState);
    resetBall(gameState);
    resetAI(gameState);
  };

  checkScore(ballX - ballRadius <= 0, 2);
  checkScore(ballX + ballRadius >= canvasWidth, 1);
}

function updateBallPosition(
  gameState: GameState,
  deltaTime: DOMHighResTimeStamp
) {
  gameState.ballX += gameState.ballSpeedX * deltaTime;
  gameState.ballY += gameState.ballSpeedY * deltaTime;
}

function calculateFPS(deltaTime: number): number {
  if (deltaTime <= 0) return 0;
  return Math.round(1 / deltaTime);
}
