import { router } from "../routing/Router.js";
import {
  deleteTournament,
  updateTournamentBracket
} from "../services/tournamentService.js";
import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { escapeHTML, getById } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { PlayedAs, PlayerType } from "../types/IMatch.js";
import { getDataOrThrow } from "../services/api.js";
import { Header2 } from "../components/Header2.js";
import { Card } from "../components/Card.js";
import { Details } from "../components/Details.js";
import ResultsView from "./ResultsView.js";
import { formatPlayerName } from "../components/NicknameInput.js";
import { GameView } from "./GameView.js";
import { toaster } from "../Toaster.js";
import { viewLogger } from "../logging/config.js";

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
    this.setTitle();
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
              text: `<b>${escapeHTML(formatPlayerName(this.player1, this.player1type))}</b>
                  vs <b>${escapeHTML(formatPlayerName(this.player2, this.player2type))}</b>`,
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
          text: this.isAIvsAI
            ? i18next.t("matchAnnouncementView.spectateMatch")
            : i18next.t("matchAnnouncementView.startMatch"),
          variant: "default",
          type: "submit",
          id: "start-match-btn"
        })}
        ${this.isAIvsAI
          ? Button({
              id: "skip-match",
              text: i18next.t("matchAnnouncementView.skipMatch"),
              variant: "default",
              type: "button"
            })
          : ""}
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
    if (this.isAIvsAI) {
      const button = getById("skip-match");
      button.addEventListener("click", () => this.handleSkipButton());
    }
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private callGameView() {
    viewLogger.debug(
      `Match ${this.matchNumber} started: ${this.player1} vs ${this.player2}`
    );

    const gameView = new GameView(
      this.player1,
      this.player2,
      this.player1type,
      this.player2type,
      this.userRole,
      this.tournament
    );
    router.switchView(gameView);
  }

  private async abortTournament() {
    try {
      if (!confirm(i18next.t("newTournamentView.confirmAbortTournament")))
        return;
      getDataOrThrow(await deleteTournament(this.tournament.getId()));
      toaster.success(i18next.t("toast.tournamentAbortSuccess"));
      router.reload();
    } catch (error) {
      toaster.error(i18next.t("toast.tournamentAbortFailed"));
      viewLogger.error("Error in abortTournament():", error);
    }
  }

  getName(): string {
    return i18next.t("matchAnnouncementView.title");
  }

  private iSAIMatchWinnerP1(): boolean {
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

    return random < weight1 ? true : false;
  }

  private async handleSkipButton() {
    if (!this.isAIvsAI) return;

    const isP1Winner = this.iSAIMatchWinnerP1();
    const winner = isP1Winner ? this.player1 : this.player2;
    const player1Score = isP1Winner ? 1 : 0;
    const player2Score = isP1Winner ? 0 : 1;

    this.tournament.updateBracketWithResult(this.matchNumber, winner);
    getDataOrThrow(
      await updateTournamentBracket({
        tournamentId: this.tournament.getId(),
        matchNumber: this.matchNumber,
        player1Score: player1Score,
        player2Score: player2Score
      })
    );

    let view = null;
    if (this.tournament.getNextMatchToPlay()) {
      view = new MatchAnnouncementView(this.tournament);
    } else {
      view = new ResultsView(this.tournament);
    }
    router.switchView(view);
  }
}
