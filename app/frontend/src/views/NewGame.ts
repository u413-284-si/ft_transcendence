import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { globalToken } from "../main.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Game");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();

    let nicknameInputs = "";
    for (let i = 1; i <= 2; i++) {
      const isChecked = i === 1 ? "checked" : "";

      nicknameInputs += /* HTML */ `
        <div class="w-[300px] border border-gray-200 p-4 rounded shadow-sm">
          <label class="font-semibold text-blue-600">
            Player ${i} Nickname:
          </label>
          <input
            type="text"
            name="player${i}"
            id="nickname${i}"
            placeholder="Enter your nickname"
            class="border border-blue-500 w-full px-2 py-1 mt-1 rounded"
          />
          <div class="mt-2">
            <label class="inline-flex items-center text-sm text-gray-600">
              <input
                type="radio"
                name="userChoice"
                value="${i}"
                class="mr-2"
                ${isChecked}
              />
              I will play as Player ${i}
            </label>
          </div>
          <span
            id="nickname-error${i}"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
      `;
    }

    return /* HTML */ `
      ${navbarHTML}
      <form
        id="register-form"
        class="flex flex-col justify-center items-center h-screen gap-4"
      >
        <p class="text-sm text-gray-500 mb-2 text-center">
          Select which player will be controlled by ${globalToken?.username}.
        </p>
        ${nicknameInputs}
        <br /><br />
        <div class="w-[300px]">
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Game
          </button>
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
    const form = document.getElementById("register-form") as HTMLFormElement;
    const formData = new FormData(form);
    const inputElements: HTMLInputElement[] = Array.from(
      form.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      form.querySelectorAll("span.error-message")
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;
    const userNumber = formData.get("userChoice");

    const gameView = new GameView(
      nicknames[0],
      nicknames[1],
      userNumber == "1" ? "PLAYERONE" : "PLAYERTWO",
      GameType.single,
      null
    );
    gameView.render();
  }
}
