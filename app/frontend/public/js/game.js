import { GameState } from "./config.js";
import { updatePaddlePositions } from "./input.js";
import { canvas } from "./init.js";
export function startGame() {
    var _a, _b, _c, _d;
    GameState.gameOver = false;
    GameState.gameStarted = true;
    resetGame();
    (_a = document.getElementById("usernameInput1")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.getElementById("usernameInput2")) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = document.getElementById("registerButton1")) === null || _c === void 0 ? void 0 : _c.remove();
    (_d = document.getElementById("registerButton2")) === null || _d === void 0 ? void 0 : _d.remove();
}
function resetGame() {
    GameState.player1Score = 0;
    GameState.player2Score = 0;
    resetBall();
}
function resetBall() {
    GameState.ballX = canvas.width / 2;
    GameState.ballY = canvas.height / 2;
    GameState.ballSpeedX *= -1; // Change direction after scoring
}
export function update() {
    if (GameState.gameOver || !GameState.gameStarted)
        return;
    updatePaddlePositions();
    // Move the ball
    GameState.ballX += GameState.ballSpeedX;
    GameState.ballY += GameState.ballSpeedY;
    // Ball collision with top & bottom
    if (GameState.ballY <= 0 || GameState.ballY >= canvas.height)
        GameState.ballSpeedY *= -1;
    // Ball collision with paddles
    if ((GameState.ballX <= 20 && GameState.ballY >= GameState.paddle1Y
        && GameState.ballY <= GameState.paddle1Y + GameState.paddleHeight) ||
        (GameState.ballX >= canvas.width - 20 && GameState.ballY >= GameState.paddle2Y
            && GameState.ballY <= GameState.paddle2Y + GameState.paddleHeight)) {
        GameState.ballSpeedX *= -1; // Reverse ball direction
    }
    // Ball out of bounds (scoring)
    if (GameState.ballX <= 0) {
        GameState.player2Score++;
        checkWinner();
        resetBall();
    }
    if (GameState.ballX >= canvas.width) {
        GameState.player1Score++;
        checkWinner();
        resetBall();
    }
}
function checkWinner() {
    if (GameState.player1Score >= 10 || GameState.player2Score >= 10) {
        GameState.gameOver = true;
    }
}
