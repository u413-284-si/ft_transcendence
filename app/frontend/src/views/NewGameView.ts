import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";

export default class NewGameView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle("New Game");
  }

  createHTML() {
    return /* HTML */ `
      <form
        id="register-form"
        class="flex flex-col justify-center items-center h-screen gap-4"
      >
        <div class="w-[300px]">
          <label for="nickname1">Player 1 Nickname:</label>
          <input
            type="text"
            id="nickname1"
            name="nickname1"
            placeholder="Enter nickname"
          />
          <span
            id="nickname-error1"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <br /><br />
        <div class="w-[300px]">
          <label for="nickname2">Player 2 Nickname:</label>
          <input
            type="text"
            id="nickname2"
            name="nickname2"
            placeholder="Enter nickname"
          />
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
    `;
  }

  protected addListeners() {
    this.formEl.addEventListener("submit", (event) =>
      this.validateAndStartGame(event)
    );
  }

  async render() {
    this.updateHTML();
    this.formEl = document.querySelector("#register-form")!;
    this.addListeners();
  }

  validateAndStartGame(event: Event) {
    event.preventDefault();
    const inputElements: HTMLInputElement[] = Array.from(
      this.formEl.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      this.formEl.querySelectorAll("span.error-message")
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;

    const gameView = new GameView(
      nicknames[0],
      nicknames[1],
      GameType.single,
      null
    );
    router.switchView(gameView);
  }

  getName(): string {
    return "new-game";
  }
}
