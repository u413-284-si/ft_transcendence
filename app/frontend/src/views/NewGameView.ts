import AbstractView from "./AbstractView.js";
import { GameType, GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import {
  initNicknameInputListeners,
  NicknameInput
} from "../components/NicknameInput.js";
import { escapeHTML, getAllBySelector, getById } from "../utility.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { Header1 } from "../components/Header1.js";
import { OrderedList } from "../components/OrderedList.js";

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
          Header1({
            text: `${i18next.t("newGameView.title")}`,
            id: "home-header",
            variant: "default"
          }),
          OrderedList({
            children: [
              i18next.t("newGameView.enterNickname"),
              i18next.t("newGameView.selectPlayer", {
                username: escapeHTML(auth.getUser().username)
              }),
              i18next.t("newGameView.aiOption")
            ]
          }),
          NicknameInput(2, auth.getUser().username),
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
    const player1type = formData.has("ai-player-1") ? "AI" : "HUMAN";
    const player2type = formData.has("ai-player-2") ? "AI" : "HUMAN";

    const gameView = new GameView(
      nicknames[0],
      nicknames[1],
      player1type,
      player2type,
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
