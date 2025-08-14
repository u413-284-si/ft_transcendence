import { router } from "../routing/Router.js";
import { deleteTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./GameView.js";
import { escapeHTML } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { playedAs } from "../types/IMatch.js";
import { getDataOrThrow } from "../services/api.js";

export default class MatchAnnouncementView extends AbstractView {
  private player1: string;
  private player2: string;
  private matchNumber: number;
  private roundNumber: number;
  private userRole: playedAs;

  constructor(private tournament: Tournament) {
    super();
    this.setTitle(i18next.t("matchAnnouncementView.title"));
    const match = this.tournament.getNextMatchToPlay();
    if (!match) {
      throw new Error(i18next.t("error.undefinedMatch"));
    }
    this.player1 = match.player1!;
    this.player2 = match.player2!;
    this.matchNumber = match.matchId;
    this.roundNumber = match.round;
    const userNickname = tournament.getUserNickname();
    this.userRole =
      this.player1 === userNickname
        ? playedAs.PLAYERONE
        : this.player2 === userNickname
          ? playedAs.PLAYERTWO
          : playedAs.NONE;
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
    `;
  }

  protected addListeners() {
    document
      .getElementById("match-form")
      ?.addEventListener("submit", (event) => this.callGameView(event));
    document
      .getElementById("abort-tournament")
      ?.addEventListener("click", () => this.abortTournament());
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
      this.userRole,
      GameType.tournament,
      this.tournament,
      "NONE"
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
}
