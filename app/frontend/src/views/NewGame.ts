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
          <span
            id="nickname-error1"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <br /><br />
        <div class="w-[300px]">
          <label for="nickname2">Player 2 Nickname:</label>
          <input type="text" id="nickname2" placeholder="Enter nickname" />
          <span
            id="nickname-error2"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <br /><br />
        <div class="w-[300px]">
          <button type="submit">Start Game</button>
        </div>
      </form>
      ${footerHTML}
    `;
  }

  protected addListeners() {
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
    const form = document.getElementById("register-form") as HTMLFormElement;
    const inputElements: HTMLInputElement[] = Array.from(
      form.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      form.querySelectorAll("span.error-message")
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;

    const gameView = new GameView(
      nicknames[0],
      nicknames[1],
      GameType.single,
      null
    );
    gameView.render();
  }
}
