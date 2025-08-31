import { router } from "../routing/Router.js";
import { deleteTournament } from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./GameView.js";
import { escapeHTML, getById } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { PlayedAs, PlayerType } from "../types/IMatch.js";
import { getDataOrThrow } from "../services/api.js";
import { Header2 } from "../components/Header2.js";
import { Card } from "../components/Card.js";
import { Details } from "../components/Details.js";

export default class MatchAnnouncementView extends AbstractView {
  private player1: string;
  private player2: string;
  private player1type: PlayerType;
  private player2type: PlayerType;
  private matchNumber: number;
  private roundNumber: number;
  private userRole: PlayedAs;

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
  }

  createHTML() {
    return /* HTML */ `
      <!-- Match Announcement -->
      <section class="flex flex-col justify-center items-center gap-4 mb-8">
        ${Header1({
          text: i18next.t("global.tournament", {
            tournamentName: escapeHTML(this.tournament.getTournamentName())
          })
        })}
        ${Header2({
          text: i18next.t("matchAnnouncementView.nextMatch"),
          variant: "default"
        })}
        ${Card({
          children: [
            Paragraph({
              text: i18next.t("matchAnnouncementView.roundMatch", {
                round: this.roundNumber,
                match: this.matchNumber
              }),
              size: "lg"
            }),
            Paragraph({
              text: `<b>${escapeHTML(this.player1)}</b>
                  vs <b>${escapeHTML(this.player2)}</b>`,
              size: "lg"
            })
          ],
          className: "min-w-md justify-center items-center"
        })}
      </section>

      <!-- Tournament Status -->
      <section class="flex flex-col justify-center items-center gap-4 mb-8">
        ${Header2({
          text: i18next.t("resultsView.bracket"),
          variant: "default"
        })}
        ${Card({
          children: [
            Details({
              summary: i18next.t("statsView.details"),
              content: this.tournament.getBracketAsHTML()
            })
          ],
          className: "min-w-md"
        })}
      </section>

      <section class="flex gap-4">
        ${Button({
          text: i18next.t("matchAnnouncementView.startMatch"),
          variant: "default",
          type: "submit",
          id: "start-match-btn"
        })}
        ${Button({
          id: "abort-tournament-btn",
          text: i18next.t("matchAnnouncementView.abortTournament"),
          variant: "danger",
          type: "button"
        })}
      </section>
    `;
  }

  protected addListeners() {
    const startMatchBtn = getById("start-match-btn");
    startMatchBtn.addEventListener("click", () => this.callGameView());
    const abortTournamentBtn = getById("abort-tournament-btn");
    abortTournamentBtn.addEventListener("click", () => this.abortTournament());
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private callGameView() {
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
}
