import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import { createTournament } from "../services/tournamentService.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import { escapeHTML, getAllBySelector, getById } from "../utility.js";
import { NicknameInput } from "../components/NicknameInput.js";
import { Header1 } from "../components/Header1.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getDataOrThrow } from "../services/api.js";
import { TournamentSize } from "../types/ITournament.js";
import { PlayerType } from "@prisma/client";
import { OrderedList } from "../components/OrderedList.js";
import { Header2 } from "../components/Header2.js";

export default class PlayerNicknamesView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor(
    private numberOfPlayers: number,
    private tournamentName: string
  ) {
    super();
    this.setTitle(i18next.t("playerNicknamesView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Header1({
        text: i18next.t("playerNicknamesView.enterPlayerNicknames"),
        variant: "default"
      })}
      ${Header2({
        text: i18next.t("global.tournament", {
          tournamentName: escapeHTML(this.tournamentName)
        }),
        className: "mb-4"
      })}
      ${OrderedList({
        children: [
          i18next.t("newGameView.enterNickname"),
          i18next.t("newGameView.selectPlayer", {
            username: escapeHTML(auth.getUser().username)
          }),
          i18next.t("playerNicknamesView.aiOptions")
        ]
      })}
      ${Form({
        children: [
          NicknameInput(this.numberOfPlayers, auth.getUser().username),
          Button({
            text: i18next.t("playerNicknamesView.submitNicknames"),
            variant: "default",
            size: "md",
            type: "submit"
          })
        ],
        id: "nicknames-form"
      })}
    `;
  }

  protected addListeners() {
    this.formEl.addEventListener("submit", (event) =>
      this.validateAndStartTournament(event)
    );
  }

  async render() {
    this.updateHTML();
    this.formEl = getById("nicknames-form");
    this.addListeners();
  }

  private async validateAndStartTournament(event: Event) {
    event.preventDefault();
    const formData = new FormData(this.formEl);
    const userNumber = formData.get("userChoice");
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
    const userNickname = formData.get(`player-${userNumber}`) as string;
    console.log(userNickname);

    const playerTypes: PlayerType[] = [];
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      const isAi = formData.has(`ai-player-${i}`);
      playerTypes.push(isAi ? "AI" : "HUMAN");
    }

    try {
      const createdTournament = getDataOrThrow(
        await createTournament({
          name: this.tournamentName,
          maxPlayers: this.numberOfPlayers as TournamentSize,
          userNickname: userNickname,
          nicknames: nicknames,
          playerTypes: playerTypes
        })
      );
      const tournament = new Tournament(createdTournament);

      const matchAnnouncementView = new MatchAnnouncement(tournament);
      router.switchView(matchAnnouncementView);
    } catch (error) {
      router.handleError("Error creating tournament", error);
    }
  }

  getName(): string {
    return "player-nicknames";
  }
}
