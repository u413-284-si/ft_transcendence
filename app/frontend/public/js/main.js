import { GameState } from "./config.js";
import { setupInputListeners } from "./input.js";
import { startGame, update } from "./game.js";
import { draw } from "./draw.js";
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
setupInputListeners();
// Start game when Enter is pressed
document.addEventListener("keydown", (event) => {
    if (!GameState.gameStarted && event.key === "Enter" && GameState.player1 && GameState.player2) {
        startGame();
    }
});
gameLoop();
