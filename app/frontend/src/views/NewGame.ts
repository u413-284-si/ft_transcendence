import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../Router.js";
import { FormTracker } from "../FormTracker.js";

export default class NewGameView extends AbstractView {
  private formElement!: HTMLFormElement;
  private formTracker!: FormTracker;

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
      ${footerHTML}
    `;
  }

  async addListeners() {
    this.formElement.addEventListener("submit", (event) =>
      this.validateAndStartGame(event)
    );
  }

  async render() {
    await this.updateHTML();
    this.formElement = document.querySelector("#register-form")!;
    this.formTracker = new FormTracker(this.formElement);
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

    this.formTracker.reset();
    const gameView = new GameView({
      nickname1: nicknames[0],

      nickname2: nicknames[1],

      type: GameType.single,

      tournament: null
    });
    router.switchView(gameView);
  }

  getName(): string {
    return "new-game";
  }

  async confirmLeave(): Promise<boolean> {
    if (this.canLeave()) return true;
    return confirm("You have unsaved changes. Do you really want to leave?");
  }

  canLeave(): boolean {
    return !this.formTracker.isDirty();
  }
}
