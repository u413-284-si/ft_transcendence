import AbstractView from "./AbstractView.js";
import { Tournament } from "../Tournament.js";
import { escapeHTML } from "../utility.js";
import { setTournamentFinished } from "../services/tournamentService.js";
import { router } from "../routing/Router.js";
import { Header1 } from "../components/Header1.js";
import { Header2 } from "../components/Header2.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { getDataOrThrow } from "../services/api.js";

export default class ResultsView extends AbstractView {
  constructor(private tournament: Tournament) {
    super();
    this.setTitle(i18next.t("resultsView.title"));
  }

  createHTML() {
    return /* HTML */ `
      <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <!-- Header Section -->
        <div class="p-6 text-center space-y-4">
          ${Header1({
            text: i18next.t("resultsView.tournamentResults"),
            id: "tournament-results-header",
            variant: "default"
          })}
          ${Paragraph({
            text: `${i18next.t("global.tournament", { tournamentName: escapeHTML(this.tournament.getTournamentName()) })}`,
            id: "tournament-name"
          })}
        </div>

        <!-- Winner Section -->
        <div class="p-6 text-center space-y-4">
          ${Header2({
            text: i18next.t("resultsView.champion"),
            id: "tournament-champion-header",
            variant: "default"
          })}
          ${Paragraph({
            text: `🏆 ${escapeHTML(this.tournament.getTournamentWinner())} 🏆`,
            id: "tournament-champion"
          })}
          ${Paragraph({
            text: i18next.t("resultsView.congratulations"),
            id: "congratulations-text"
          })}
        </div>

        <!-- Bracket Section -->
        <div class="rounded-2xl shadow p-6 text-center space-y-2">
          ${Header2({
            text: i18next.t("resultsView.bracket"),
            id: "tournament-bracket-header",
            variant: "default"
          })}
          <div class="mb-6">${this.tournament.getBracketAsHTML()}</div>
        </div>

        <!-- Button Section -->
        <div class="mt-1 flex justify-center space-x-4">
          ${Button({
            id: "finish-btn",
            text: i18next.t("resultsView.finish"),
            variant: "default",
            type: "button"
          })}
        </div>
      </div>
    `;
  }

  protected addListeners(): void {
    document
      .getElementById("finish-btn")!
      .addEventListener("click", () => this.setFinished());
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  private async setFinished() {
    try {
      getDataOrThrow(await setTournamentFinished(this.tournament.getId()));
      router.reload();
    } catch (error) {
      router.handleError("Error setting tournament as finished", error);
    }
  }

  getName(): string {
    return "results";
  }
}
