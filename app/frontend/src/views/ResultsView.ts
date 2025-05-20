import AbstractView from "./AbstractView.js";
import { BracketMatch } from "../types/IMatch.js";
import { Tournament } from "../Tournament.js";
import { escapeHTML } from "../utility.js";

export default class ResultsView extends AbstractView {
  private matches: BracketMatch[];

  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Results");
    this.matches = tournament.getBracket();
  }

  createHTML() {
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();
    const bracketsHTML = this.generateBracketHTML(this.matches);

    return /* HTML */ `
      ${navbarHTML}
      <div class="max-w-3xl mx-auto bg-gray-100 text-gray-900 p-6">
        <h1 class="text-3xl font-bold mb-4 leading-tight">
          Tournament ${escapeHTML(this.tournament.getTournamentName())}<br />
          <span
            class="inline-block transition-opacity duration-700 delay-200 opacity-0 translate-y-2 animate-show-results"
            >Results</span
          >
        </h1>
        <div id="winner" class="text-xl font-semibold mb-2">
          🏆 Winner: ${escapeHTML(this.tournament.getTournamentWinner())}
        </div>
        <div id="brackets" class="space-y-4">${bracketsHTML}</div>
      </div>
      ${footerHTML}
    `;
  }

  async render() {
    this.updateHTML();
  }

  private generateBracketHTML(matches: BracketMatch[]): string {
    const matchesByRound = this.groupBy(matches, "round");
    let html = "";

    for (const [roundStr, roundMatches] of Object.entries(matchesByRound)) {
      const round = parseInt(roundStr);

      html += `
      <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300">
        <h2 class="text-lg font-bold mb-2">Round ${round}</h2>
        ${roundMatches
          .map((match) => {
            const player1 = escapeHTML(match.player1 ?? "TBD");
            const player2 = escapeHTML(match.player2 ?? "TBD");
            const winner = match.winner ? escapeHTML(match.winner) : "";

            return `
              <div class="flex justify-between items-center mb-2 p-2 border rounded bg-gray-50">
                <div class="font-medium">
                  ${player1} vs ${player2}
                </div>
                <div class="text-green-600 font-semibold">
                  ${winner ? `Winner: ${winner}` : ""}
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
    }

    return html;
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
