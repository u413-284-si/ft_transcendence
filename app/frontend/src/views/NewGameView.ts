import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import { NicknameInput } from "../components/NicknameInput.js";
import { Paragraph } from "../components/Paragraph.js";
import { escapeHTML } from "../utility.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";

export default class NewGameView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle("New Game");
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Paragraph({
            text: `Select which player will be controlled by ${escapeHTML(auth.getToken().username)}.`
          }),
          NicknameInput(2),
          Button({
            text: "Start Game",
            variant: "default",
            size: "md",
            type: "submit"
          })
        ],
        id: "register-form"
      })}
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
    const form = document.getElementById("register-form") as HTMLFormElement;
    const formData = new FormData(form);
    const inputElements: HTMLInputElement[] = Array.from(
      this.formEl.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      this.formEl.querySelectorAll('[id^="player-error-"]')
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
    router.switchView(gameView);
  }

  getName(): string {
    return "new-game";
  }
}
