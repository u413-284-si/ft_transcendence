import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import {
  getPlayerType,
  initNicknameInputListeners,
  NicknameInput
} from "../components/NicknameInput.js";
import { Paragraph } from "../components/Paragraph.js";
import { escapeHTML, getAllBySelector, getById } from "../utility.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import type { PlayerType } from "../types/IMatch.js";

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
    this.formEl = getById("register-form");
    this.addListeners();
  }

  validateAndStartGame(event: Event) {
    event.preventDefault();
    const formData = new FormData(this.formEl);
    const inputElements = getAllBySelector<HTMLInputElement>(
      "input[type='text']",
      { root: this.formEl }
    );
    const errorElements = getAllBySelector<HTMLElement>(
      '[id^="player-error-"]',
      { root: this.formEl }
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;

    const userNumber = formData.get("userChoice");
    const playerTypes: PlayerType[] = [];
    for (let i = 1; i <= 2; i++) {
      playerTypes.push(getPlayerType(formData, i));
    }

    const gameView = new GameView(
      nicknames[0],
      nicknames[1],
      playerTypes[0],
      playerTypes[1],
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
