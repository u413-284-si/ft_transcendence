import AbstractView from "./AbstractView.js";
import { BracketMatch } from "../types/IMatch.js";
import { Tournament } from "../Tournament.js";

export default class ResultsView extends AbstractView {
  private matches: BracketMatch[];

  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Results");
    this.matches = tournament.getBracket();
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <div class="max-w-3xl mx-auto bg-gray-100 text-gray-900 p-6">
        <h1 class="text-3xl font-bold mb-4">
          Tournament Results: ${this.tournament.getTournamentName()}
        </h1>
        <div id="winner" class="text-xl font-semibold mb-2">
          🏆 Winner: ${this.tournament.getTournamentWinner()}
        </div>
        ${this.tournament.getBracketAsHTML()}
      </div>
      ${footerHTML}
    `;
  }

  async render() {
    await this.updateHTML();
  }
}
