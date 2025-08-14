import { updatePaddlePositions } from "./input.js";
import { draw } from "./draw.js";
import { GameState } from "./types/IGameState.js";
import { GameKey } from "./views/GameView.js";
import { Tournament } from "./Tournament.js";
import { updateTournamentBracket } from "./services/tournamentService.js";
import { createMatch } from "./services/matchServices.js";
import { playedAs } from "./types/IMatch.js";
import { getDataOrThrow } from "./services/api.js";
import { PlayerAI } from "./PlayerAI.js";

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
  userRole: playedAs,
  tournament: Tournament | null,
  keys: Record<GameKey, boolean>,
  aiRole: "NONE" | "PLAYERONE" | "PLAYERTWO" | "BOTH"
) {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  setIsAborted(false);
  let playerAI1: PlayerAI | null = null;
  let playerAI2: PlayerAI | null = null;
  if (aiRole === "PLAYERONE" || aiRole === "BOTH") {
    playerAI1 = new PlayerAI("left", { reactionInterval: 800 });
  }
  if (aiRole === "PLAYERTWO" || aiRole === "BOTH") {
    playerAI2 = new PlayerAI("right", { reactionInterval: 800 });
  }
  const gameState = initGameState(
    canvas,
    nickname1,
    nickname2,
    keys,
    playerAI1,
    playerAI2
  );
  await new Promise<void>((resolve) => {
    gameLoop(ctx, gameState, resolve);
  });
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
  playerAI1: PlayerAI | null,
  playerAI2: PlayerAI | null
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
    ballSpeedX: 7,
    ballSpeedY: 7,
    paddle1X: 10,
    paddle1Y: canvas.height / 2 - 40,
    paddle2X: canvas.width - 20,
    paddle2Y: canvas.height / 2 - 40,
    paddleHeight: 80,
    paddleWidth: 10,
    paddleSpeed: 6,
    gameOver: false,
    keys: keys,
    playerAI1: playerAI1,
    playerAI2: playerAI2
  };
}

function gameLoop(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  resolve: () => void
) {
  if (gameState.gameOver) {
    resolve();
    return;
  }
  update(gameState);
  draw(ctx, gameState);
  requestAnimationFrame(() => gameLoop(ctx, gameState, resolve));
}

function update(gameState: GameState) {
  if (gameState.gameOver) return;

  updatePaddlePositions(gameState);

  if (gameState.playerAI1) {
    gameState.playerAI1.updatePerception(gameState);

    const move = gameState.playerAI1.decideMove(
      gameState.paddle1Y,
      gameState.paddleHeight
    );

    gameState.keys["w"] = move === "up";
    gameState.keys["s"] = move === "down";
  }

  if (gameState.playerAI2) {
    gameState.playerAI2.updatePerception(gameState);

    const move = gameState.playerAI2.decideMove(
      gameState.paddle2Y,
      gameState.paddleHeight
    );

    gameState.keys["ArrowUp"] = move === "up";
    gameState.keys["ArrowDown"] = move === "down";
  }

  // Move the ball
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // Ball collision with top & bottom
  if (gameState.ballY <= 0 || gameState.ballY >= gameState.canvasHeight)
    gameState.ballSpeedY *= -1;

  // Ball collision with paddles
  if (
    (gameState.ballX <= gameState.paddle1X &&
      gameState.ballY >= gameState.paddle1Y &&
      gameState.ballY <= gameState.paddle1Y + gameState.paddleHeight) ||
    (gameState.ballX >= gameState.paddle2X &&
      gameState.ballY >= gameState.paddle2Y &&
      gameState.ballY <= gameState.paddle2Y + gameState.paddleHeight)
  ) {
    gameState.ballSpeedX *= -1; // Reverse ball direction
  }

  // Ball out of bounds (scoring)
  if (gameState.ballX <= 0) {
    gameState.player2Score++;
    checkWinner(gameState);
    resetBall(gameState);
  }

  if (gameState.ballX >= gameState.canvasWidth) {
    gameState.player1Score++;
    checkWinner(gameState);
    resetBall(gameState);
  }
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
