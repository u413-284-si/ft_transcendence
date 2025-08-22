import { router } from "../routing/Router.js";
import { getUserTournaments } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import PlayerNicknames from "./PlayerNicknamesView.js";
import {
  validateTournamentName,
  validatePlayersSelection,
  isTournamentNameAvailable
} from "../validate.js";
import ResultsView from "./ResultsView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { RadioGroup } from "../components/RadioGroup.js";
import { Form } from "../components/Form.js";
import { getDataOrThrow } from "../services/api.js";
import { auth } from "../AuthManager.js";

export default class NewTournamentView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle(i18next.t("newTournamentView.title"));
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Header1({
            text: i18next.t("newTournamentView.title"),
            variant: "default"
          }),
          Paragraph({
            text: i18next.t("newTournamentView.newTournamentDescription")
          }),
          Input({
            id: "tournament-name-input",
            label: i18next.t("newTournamentView.tournamentName"),
            name: "tournament-name",
            placeholder: i18next.t("newTournamentView.enterTournamentName"),
            type: "text",
            errorId: "tournament-name-error"
          }),
          RadioGroup({
            name: "players",
            label: i18next.t("newTournamentView.numberOfPlayers"),
            options: [
              {
                id: "players-4",
                value: "4",
                label: i18next.t("newTournamentView.players4")
              },
              {
                id: "players-8",
                value: "8",
                label: i18next.t("newTournamentView.players8")
              },
              {
                id: "players-16",
                value: "16",
                label: i18next.t("newTournamentView.players16")
              }
            ],
            selectedValue: "4",
            errorId: "player-error",
            layout: "vertical"
          }),
          Button({
            text: i18next.t("newTournamentView.startTournament"),
            variant: "default",
            size: "md",
            type: "submit"
          })
        ],
        id: "tournament-form"
      })}
    `;
  }

  protected addListeners() {
    this.formEl.addEventListener("submit", (event) =>
      this.validateAndRequestNicknames(event)
    );
  }

  async render() {
    const tournamentsPage = getDataOrThrow(
      await getUserTournaments({
        username: auth.getUser().username,
        isFinished: false
      })
    );
    if (tournamentsPage.items.length === 0) {
      console.log("No active tournament found");
      this.updateHTML();
      this.formEl = document.querySelector("#tournament-form")!;
      this.addListeners();
      return;
    }
    const activeTournament = tournamentsPage.items[0];
    const tournament = new Tournament(activeTournament);
    if (tournament.getNextMatchToPlay()) {
      router.switchView(new MatchAnnouncement(tournament));
    } else {
      router.switchView(new ResultsView(tournament));
    }
    return;
  }

  async validateAndRequestNicknames(event: Event) {
    event.preventDefault();
    const playersSelected = this.formEl.querySelector(
      'input[name="players"]:checked'
    ) as HTMLInputElement;
    const tournamentNameEl = document.getElementById(
      "tournament-name-input"
    ) as HTMLInputElement;
    const selectionEl = document.querySelector(
      'input[name="players"]'
    ) as HTMLInputElement;
    const tournamentErrorEl = document.getElementById(
      "tournament-name-error"
    ) as HTMLElement;
    const playerErrorEl = document.getElementById(
      "player-error"
    ) as HTMLElement;
    let isValid = true;

    if (
      !validateTournamentName(tournamentNameEl, tournamentErrorEl) ||
      !(await isTournamentNameAvailable(
        auth.getUser().username,
        tournamentNameEl,
        tournamentErrorEl
      ))
    ) {
      isValid = false;
    }
    if (
      !validatePlayersSelection(playersSelected, selectionEl, playerErrorEl)
    ) {
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    const playerNum = parseInt(playersSelected.value);
    console.log(
      `Tournament "${tournamentNameEl.value}" started with ${playerNum} players`
    );

    // Navigate to the PlayerNicknames view
    const playerNicknamesView = new PlayerNicknames(
      playerNum,
      tournamentNameEl.value
    );
    router.switchView(playerNicknamesView);
  }

  getName(): string {
    return "new-tournament";
  }
}
