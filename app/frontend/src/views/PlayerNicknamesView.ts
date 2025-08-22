import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import { createTournament } from "../services/tournamentService.js";
import { validateNicknames } from "../validate.js";
import { router } from "../routing/Router.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";
import { NicknameInput } from "../components/NicknameInput.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { getDataOrThrow } from "../services/api.js";
import { TournamentSize } from "../types/ITournament.js";

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
      ${Form({
        children: [
          Header1({
            text: i18next.t("playerNicknamesView.enterPlayerNicknames"),
            variant: "default"
          }),
          Paragraph({
            text: i18next.t("global.tournament", {
              tournamentName: escapeHTML(this.tournamentName)
            })
          }),
          Paragraph({
            text: i18next.t("playerNicknamesView.selectControlledPlayer", {
              username: escapeHTML(auth.getUser().username)
            })
          }),
          NicknameInput(this.numberOfPlayers),
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
    this.formEl = document.querySelector("#nicknames-form")!;
    this.addListeners();
  }

  private async validateAndStartTournament(event: Event) {
    event.preventDefault();
    const form = document.getElementById("nicknames-form") as HTMLFormElement;
    const formData = new FormData(form);
    const userNumber = formData.get("userChoice");
    const inputElements: HTMLInputElement[] = Array.from(
      this.formEl.querySelectorAll("input[type='text']")
    );
    const errorElements: HTMLElement[] = Array.from(
      this.formEl.querySelectorAll('[id^="player-error-"]')
    );
    const nicknames = inputElements.map((input) => input.value);

    if (!validateNicknames(inputElements, errorElements, nicknames)) return;
    const userNickname = formData.get(`player-${userNumber}`) as string;
    console.log(userNickname);

    try {
      const createdTournament = getDataOrThrow(
        await createTournament({
          name: this.tournamentName,
          maxPlayers: this.numberOfPlayers as TournamentSize,
          userNickname: userNickname,
          nicknames: nicknames,
          playerTypes: Array(this.numberOfPlayers).fill("HUMAN")
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
