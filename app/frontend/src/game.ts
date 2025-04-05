import { updatePaddlePositions } from "./input.js";
import { draw } from "./draw.js";
import { GameState } from "./types/IGameState.js";
import { Match } from "./types/IMatch.js";
import NewGame from "./views/NewGame.js";
import { GameType, GameKey } from "./views/Game.js";
import { Tournament } from "./Tournament.js";
import MatchAnnouncement from "./views/MatchAnnouncement.js";

export async function startGame(
  player1: string,
  player2: string,
  type: GameType,
  keys: Record<GameKey, boolean>,
  controller: AbortController,
  tournament: Tournament | null = null
) {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  const gameState = initGameState(canvas, player1, player2, keys);
  await new Promise<void>((resolve) => {
    gameLoop(canvas, ctx, gameState, resolve);
  });
  await endGame(gameState);
  controller.abort();
  if (type == GameType.single) {
    const newGameView = new NewGame();
    await newGameView.render();
  }
  if (type == GameType.tournament) {
    if (tournament) {
      tournament.setWinner(
        gameState.player1Score > gameState.player2Score ? player1 : player2
      );
      const matchAnnouncementView = new MatchAnnouncement(tournament);
      await matchAnnouncementView.render();
    }
  }
}

function initGameState(
  canvas: HTMLCanvasElement,
  player1: string,
  player2: string,
  keys: Record<GameKey, boolean>
): GameState {
  return {
    player1: player1,
    player2: player2,
    player1Score: 0,
    player2Score: 0,
    winningScore: 3,
    ballX: canvas.width / 2,
    ballY: canvas.height / 2,
    ballSpeedX: 7,
    ballSpeedY: 7,
    paddle1Y: canvas.height / 2 - 40,
    paddle2Y: canvas.height / 2 - 40,
    paddleHeight: 80,
    paddleWidth: 10,
    paddleSpeed: 6,
    gameOver: false,
    keys: keys
  };
}

function gameLoop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  resolve: () => void
) {
  if (gameState.gameOver) {
    resolve();
    return;
  }
  update(canvas, gameState);
  draw(canvas, ctx, gameState);
  requestAnimationFrame(() => gameLoop(canvas, ctx, gameState, resolve));
}

function update(canvas: HTMLCanvasElement, gameState: GameState) {
  if (gameState.gameOver) return;

  updatePaddlePositions(canvas, gameState);

  // Move the ball
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // Ball collision with top & bottom
  if (gameState.ballY <= 0 || gameState.ballY >= canvas.height)
    gameState.ballSpeedY *= -1;

  // Ball collision with paddles
  if (
    (gameState.ballX <= 20 &&
      gameState.ballY >= gameState.paddle1Y &&
      gameState.ballY <= gameState.paddle1Y + gameState.paddleHeight) ||
    (gameState.ballX >= canvas.width - 20 &&
      gameState.ballY >= gameState.paddle2Y &&
      gameState.ballY <= gameState.paddle2Y + gameState.paddleHeight)
  ) {
    gameState.ballSpeedX *= -1; // Reverse ball direction
  }

  // Ball out of bounds (scoring)
  if (gameState.ballX <= 0) {
    gameState.player2Score++;
    checkWinner(gameState);
    resetBall(canvas, gameState);
  }

  if (gameState.ballX >= canvas.width) {
    gameState.player1Score++;
    checkWinner(gameState);
    resetBall(canvas, gameState);
  }
}

function resetBall(canvas: HTMLCanvasElement, gameState: GameState) {
  gameState.ballX = canvas.width / 2;
  gameState.ballY = canvas.height / 2;
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

async function endGame(gameState: GameState) {
  await saveMatch({
    playerId: 1,
    playerNickname: gameState.player1,
    opponentNickname: gameState.player2,
    playerScore: gameState.player1Score,
    opponentScore: gameState.player2Score
  });

  await waitForEnterKey();
}

async function saveMatch(match: Match) {
  try {
    const response = await fetch("http://localhost:4000/api/matches/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(match)
    });

    if (!response.ok) {
      throw new Error("Failed to save match");
    }

    const data = await response.json();
    console.log("Match saved:", data);
  } catch (error) {
    console.error("Error saving match:", error);
  }
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
