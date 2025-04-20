import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { hasDuplicates } from "../validate.js";
import { router } from "../Router.js";

export default class NewGameView extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Game");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return `
			${navbarHTML}
			<form id="register-form">
				<label for="nickname1">Player 1 Nickname:</label>
				<input type="text" id="nickname1" placeholder="Enter nickname"><br><br>
				<label for="nickname2">Player 2 Nickname:</label>
				<input type="text" id="nickname2" placeholder="Enter nickname"><br><br>
				<button type="submit">Start Game</button>
			</form>
			${footerHTML}
			`;
  }

  async addListeners() {
    document
      .getElementById("register-form")
      ?.addEventListener("submit", (event) => this.validateAndStartGame(event));
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

    if (nickname1 === "" || nickname2 === "") {
      event.preventDefault();
      return alert("Please enter a nickname for both players.");
    }

    const nicknames = [nickname1, nickname2];
    if (hasDuplicates(nicknames)) {
      event.preventDefault();
      return alert("Nicknames must be unique");
    }

    const gameView = new GameView({
      nickname1,
      nickname2,
      type: GameType.single,
      tournament: null
    });
    router.navigateToView(gameView);
  }
}
