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
        <div id="brackets" class="space-y-4"></div>
      </div>
      ${footerHTML}
    `;
  }

  async render() {
    await this.updateHTML();
    this.renderBracket(this.matches);
  }

  private renderBracket(matches: BracketMatch[]) {
    const bracketsDiv = document.getElementById("brackets")!;
    bracketsDiv.innerHTML = "";

    const matchesByRound = this.groupBy(matches, "round");

    for (const [roundStr, roundMatches] of Object.entries(matchesByRound)) {
      const round = parseInt(roundStr);
      const roundDiv = document.createElement("div");
      roundDiv.className =
        "bg-white shadow-md rounded-lg p-4 border border-gray-300";

      const title = document.createElement("h2");
      title.className = "text-lg font-bold mb-2";
      title.textContent = `Round ${round}`;
      roundDiv.appendChild(title);

      for (const match of roundMatches) {
        const matchEl = document.createElement("div");
        matchEl.className =
          "flex justify-between items-center mb-2 p-2 border rounded bg-gray-50";

        matchEl.innerHTML = `
          <div class="font-medium">
            ${match.player1 ?? "TBD"} vs ${match.player2 ?? "TBD"}
          </div>
          <div class="text-green-600 font-semibold">
            ${match.winner ? `Winner: ${match.winner}` : ""}
          </div>
        `;

        roundDiv.appendChild(matchEl);
      }

      bracketsDiv.appendChild(roundDiv);
    }
  }

  private groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce(
      (acc, item) => {
        const group = String(item[key]);
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      },
      {} as Record<string, T[]>
    );
  }

  getName(): string {
    return "results";
  }
}
