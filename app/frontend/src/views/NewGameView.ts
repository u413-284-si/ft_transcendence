import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import {
  initNicknameInputListeners,
  NicknameInput
} from "../components/NicknameInput.js";
import { Paragraph } from "../components/Paragraph.js";
import { escapeHTML, getById } from "../utility.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { playedAs } from "../types/IMatch.js";

export default class NewGameView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle(i18next.t("newGameView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Paragraph({
            text: i18next.t("newGameView.selectPlayer", {
              username: escapeHTML(auth.getUser().username)
            })
          }),
          NicknameInput(2),
          Button({
            text: i18next.t("newGameView.startGame"),
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
    initNicknameInputListeners();
  }

  async render() {
    this.updateHTML();
    this.formEl = getById<HTMLFormElement>("register-form");
    this.addListeners();
  }

  validateAndStartGame(event: Event) {
    event.preventDefault();
    const form = getById<HTMLFormElement>("register-form");
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
    const player1type = formData.has("ai-player-1") ? "AI" : "HUMAN";
    const player2type = formData.has("ai-player-2") ? "AI" : "HUMAN";

    const gameView = new GameView(
      nicknames[0],
      nicknames[1],
      player1type,
      player2type,
      userNumber == "1" ? playedAs.PLAYERONE : playedAs.PLAYERTWO,
      GameType.single,
      null
    );
    router.switchView(gameView);
  }

  getName(): string {
    return "new-game";
  }
}
