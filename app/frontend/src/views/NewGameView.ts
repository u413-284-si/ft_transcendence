import AbstractView from "./AbstractView.js";
import { GameView } from "./GameView.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import {
  getPlayerType,
  initNicknameInputListeners,
  NicknameInput
} from "../components/NicknameInput.js";
import { escapeHTML, getAllBySelector, getById } from "../utility.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import type { PlayerType } from "../types/IMatch.js";
import { Header1 } from "../components/Header1.js";
import { List } from "../components/List.js";

export default class NewGameView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle();
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
          List({
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

  protected override addListeners() {
    this.formEl.addEventListener("submit", (event) =>
      this.validateAndStartGame(event)
    );
    initNicknameInputListeners();
  }

  protected override cacheNodes(): void {
    this.formEl = getById("register-form");
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
      null
    );
    router.switchView(gameView);
  }

  getName(): string {
    return i18next.t("newGameView.title");
  }
}
