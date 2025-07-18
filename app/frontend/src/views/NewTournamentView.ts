import { router } from "../routing/Router.js";
import { getActiveTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import { BracketMatch } from "../types/IMatch.js";
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

export default class NewTournamentView extends AbstractView {
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.setTitle("New Tournament");
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Header1({
            text: "New Tournament",
            variant: "default"
          }),
          Paragraph({
            text: "Enter the tournament name and select the number of players"
          }),
          Input({
            id: "tournament-name-input",
            label: "Tournament Name:",
            name: "tournament-name",
            type: "text",
            errorId: "tournament-name-error"
          }),
          RadioGroup({
            name: "players",
            label: "Number of players",
            options: [
              { id: "players-4", value: "4", label: "4 players" },
              { id: "players-8", value: "8", label: "8 players" },
              { id: "players-16", value: "16", label: "16 players" }
            ],
            selectedValue: "4",
            errorId: "player-error",
            layout: "vertical"
          }),
          Button({
            text: "Start Tournament",
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
    const activeTournament = getDataOrThrow(await getActiveTournament());
    if (!activeTournament) {
      console.log("No active tournament found");
      this.updateHTML();
      this.formEl = document.querySelector("#tournament-form")!;
      this.addListeners();
      return;
    }
    const bracket = JSON.parse(activeTournament.bracket) as BracketMatch[];
    const tournament = new Tournament(
      activeTournament.name,
      activeTournament.maxPlayers,
      activeTournament.userId,
      activeTournament.userNickname,
      bracket,
      activeTournament.id
    );
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
      !(await isTournamentNameAvailable(tournamentNameEl, tournamentErrorEl))
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
