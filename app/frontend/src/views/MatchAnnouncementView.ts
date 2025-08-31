import { router } from "../routing/Router.js";
import {
  deleteTournament,
  updateTournamentBracket
} from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./GameView.js";
import { escapeHTML, getById } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { PlayedAs, PlayerType } from "../types/IMatch.js";
import { getDataOrThrow } from "../services/api.js";
import ResultsView from "./ResultsView.js";

export default class MatchAnnouncementView extends AbstractView {
  private player1: string;
  private player2: string;
  private player1type: PlayerType;
  private player2type: PlayerType;
  private matchNumber: number;
  private roundNumber: number;
  private userRole: PlayedAs;
  private isAIvsAI: boolean;

  constructor(private tournament: Tournament) {
    super();
    this.setTitle(i18next.t("matchAnnouncementView.title"));
    const match = this.tournament.getNextMatchToPlay();
    if (!match) {
      throw new Error(i18next.t("error.undefinedMatch"));
    }
    this.player1 = match.player1Nickname!;
    this.player2 = match.player2Nickname!;
    this.player1type = match.player1Type!;
    this.player2type = match.player2Type!;
    this.matchNumber = match.matchNumber;
    this.roundNumber = match.round;
    const userNickname = tournament.getUserNickname();
    this.userRole =
      this.player1 === userNickname
        ? "PLAYERONE"
        : this.player2 === userNickname
          ? "PLAYERTWO"
          : "NONE";
    const aiTypes: PlayerType[] = ["AI_EASY", "AI_MEDIUM", "AI_HARD"];
    this.isAIvsAI =
      aiTypes.includes(this.player1type) && aiTypes.includes(this.player2type);
  }

  createHTML() {
    return /* HTML */ `
      <!-- Match Announcement -->
      <section>
        ${Form({
          children: [
            Header1({
              text: i18next.t("matchAnnouncementView.nextMatch"),
              variant: "default"
            }),
            Paragraph({
              text: i18next.t("matchAnnouncementView.roundMatch", {
                round: this.roundNumber,
                match: this.matchNumber
              })
            }),
            Paragraph({
              text: `<b>${escapeHTML(this.player1)}</b>
              vs <b>${escapeHTML(this.player2)}</b>`
            }),
            Button({
              text: i18next.t("matchAnnouncementView.startMatch"),
              variant: "default",
              type: "submit"
            })
          ],
          id: "match-form"
        })}
      </section>

      <!-- Tournament Status -->
      <section>
        <div class="pt-18 p-6 text-center space-y-6">
          ${Header1({
            text: i18next.t("matchAnnouncementView.tournamentStatus"),
            variant: "default"
          })}

          <div class="mb-6">${this.tournament.getBracketAsHTML()}</div>

          ${Button({
            id: "abort-tournament",
            text: i18next.t("matchAnnouncementView.abortTournament"),
            variant: "danger",
            type: "button"
          })}
        </div>
      </section>

      ${this.isAIvsAI
        ? Button({
            id: "skip-match",
            text: "Skip",
            variant: "default",
            type: "button"
          })
        : ""}
    `;
  }

  protected addListeners() {
    document
      .getElementById("match-form")
      ?.addEventListener("submit", (event) => this.callGameView(event));
    document
      .getElementById("abort-tournament")
      ?.addEventListener("click", () => this.abortTournament());
    if (this.isAIvsAI) {
      const button = getById("skip-match");
      button.addEventListener("click", () => this.handleSkipButton());
    }
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private callGameView(event: Event) {
    event.preventDefault();
    console.log(
      `Match ${this.matchNumber} started: ${this.player1} vs ${this.player2}`
    );

    const gameView = new GameView(
      this.player1,
      this.player2,
      this.player1type,
      this.player2type,
      this.userRole,
      GameType.tournament,
      this.tournament
    );
    router.switchView(gameView);
  }

  private async abortTournament() {
    try {
      if (!confirm(i18next.t("newTournamentView.confirmAbortTournament")))
        return;
      getDataOrThrow(await deleteTournament(this.tournament.getId()));
      router.reload();
    } catch (error) {
      router.handleError("Error while deleting tournament", error);
    }
  }

  getName(): string {
    return "match-announcement";
  }

  private decideAIvsAIWinner(): "player1" | "player2" {
    const AI_WEIGHTS: Record<Exclude<PlayerType, "HUMAN">, number> = {
      AI_EASY: 1,
      AI_MEDIUM: 2,
      AI_HARD: 3
    };

    const weight1 =
      AI_WEIGHTS[this.player1type as Exclude<PlayerType, "HUMAN">];
    const weight2 =
      AI_WEIGHTS[this.player2type as Exclude<PlayerType, "HUMAN">];

    const total = weight1 + weight2;
    const random = Math.random() * total;

    return random < weight1 ? "player1" : "player2";
  }

  private async handleSkipButton() {
    if (!this.isAIvsAI) return;

    const winner = this.decideAIvsAIWinner();
    const player1Score = winner === "player1" ? 1 : 0;
    const player2Score = winner === "player2" ? 1 : 0;

    this.tournament.updateBracketWithResult(this.matchNumber, winner);
    getDataOrThrow(
      await updateTournamentBracket({
        tournamentId: this.tournament.getId(),
        matchNumber: this.matchNumber,
        player1Score: player1Score,
        player2Score: player2Score
      })
    );

    if (this.tournament.getNextMatchToPlay()) {
      const view = new MatchAnnouncementView(this.tournament);
      router.switchView(view);
    } else {
      const view = new ResultsView(this.tournament);
      router.switchView(view);
    }
  }
}
