import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Game");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <form
        id="register-form"
        class="flex flex-col justify-center items-center h-screen gap-4"
      >
        <div class="w-[300px]">
          <label for="nickname1">Player 1 Nickname:</label>
          <input type="text" id="nickname1" placeholder="Enter nickname" />
        </div>
        <br /><br />
        <div class="w-[300px]">
          <label for="nickname2">Player 2 Nickname:</label>
          <input type="text" id="nickname2" placeholder="Enter nickname" />
        </div>
        <br /><br />
        <div class="w-[300px]">
          <button type="submit">Start Game</button>
        </div>
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
    event.preventDefault();
    const nickname1: string = (
      document.getElementById("nickname1") as HTMLInputElement
    ).value;

    const nickname2: string = (
      document.getElementById("nickname2") as HTMLInputElement
    ).value;
    const form = document.getElementById("register-form") as HTMLFormElement;
    const inputs = Array.from(
      form.querySelectorAll("input[type='text']")
    ) as HTMLInputElement[];

    if (!validateNicknames(inputs)) return;

    const gameView = new GameView(nickname1, nickname2, GameType.single, null);
    gameView.render();
  }
}
