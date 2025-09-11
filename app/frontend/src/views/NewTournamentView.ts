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
import { Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { RadioGroup } from "../components/RadioGroup.js";
import { Form } from "../components/Form.js";
import { getDataOrThrow } from "../services/api.js";
import { auth } from "../AuthManager.js";
import { getById, getBySelector } from "../utility.js";
import { List } from "../components/List.js";
import { Card } from "../components/Card.js";
import { viewLogger } from "../logging/config.js";

export default class NewTournamentView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle();
  }

  override async mount(): Promise<void> {
    const tournamentsPage = getDataOrThrow(
      await getUserTournaments({
        username: auth.getUser().username,
        isFinished: false
      })
    );
    if (tournamentsPage.items.length === 0) {
      viewLogger.debug("No active tournament found");
      super.render();
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

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Header1({
            text: i18next.t("newTournamentView.title"),
            variant: "default"
          }),
          List({
            children: [
              i18next.t("newTournamentView.enterTournamentName"),
              i18next.t("newTournamentView.selectNumberPlayers")
            ]
          }),
          Card({
            children: [
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
              })
            ]
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

  protected override addListeners() {
    this.formEl.addEventListener("submit", (event) =>
      this.validateAndRequestNicknames(event)
    );
  }

  protected override cacheNodes(): void {
    this.formEl = getById("tournament-form");
  }

  async validateAndRequestNicknames(event: Event) {
    event.preventDefault();
    const playersSelected = this.formEl.querySelector(
      'input[name="players"]:checked'
    ) as HTMLInputElement;
    const tournamentNameEl = getById<HTMLInputElement>("tournament-name-input");
    const selectionEl = getBySelector<HTMLInputElement>(
      'input[name="players"]'
    );
    const tournamentErrorEl = getById<HTMLElement>("tournament-name-error");
    const playerErrorEl = getById<HTMLElement>("player-error");
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
    viewLogger.debug(
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
    return i18next.t("newTournamentView.title");
  }
}
