import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./Game.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Game");
  }

  async createHTML() {
    return `
			<form id="register-form">
				<label for="nickname1">Player 1 Nickname:</label>
				<input type="text" id="nickname1" placeholder="Enter nickname"><br><br>
				<label for="nickname2">Player 2 Nickname:</label>
				<input type="text" id="nickname2" placeholder="Enter nickname"><br><br>
				<button id="start-button">Start Game</button>
			</form>
			`;
  }

  async addListeners() {
    document
      .getElementById("start-button")
      ?.addEventListener("click", (event) => this.validateAndStartGame(event));
  }

  async render() {
    await this.updateHTML();
    this.addListeners();
  }

  validateAndStartGame(event: Event) {
    const nickname1: string = (
      document.getElementById("nickname1") as HTMLInputElement
    ).value.trim();
    const nickname2: string = (
      document.getElementById("nickname2") as HTMLInputElement
    ).value.trim();

    if (!nickname1 || !nickname2) {
      event.preventDefault();
      return alert("Please enter a nickname for both players.");
    } else if (nickname1 === nickname2) {
      event.preventDefault();
      return alert("Nicknames must be different.");
    }

    const gameView = new GameView(nickname1, nickname2, GameType.single);
    gameView.render();
  }
}
