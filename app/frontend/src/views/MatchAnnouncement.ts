import { Tournament } from "../Tournament.js";
import AbstractView from "./AbstractView.js";
import { GameView, GameType } from "./Game.js";

export default class extends AbstractView {
  private player1: string | null = null;
  private player2: string | null = null;

  constructor(private tournament: Tournament) {
    super();
    this.setTitle("Match Announcement");
    const match = this.tournament.getNextBracket();
    if (!match) {
      // render WinView;
      return;
    }
    this.player1 = match[0];
    this.player2 = match[1];
  }

  async createHTML() {
    return `
      <h1 style="
        margin-bottom: 20px; 
        font-size: 2em; 
        color: #007BFF; 
        text-align: center;"
      >
        Match ${this.tournament.getMatchNumber()}
      </h1>
      <p style="margin-bottom: 20px; text-align: center; font-size: 1.5em;">
        <strong>${this.player1}</strong> vs <strong>${this.player2}</strong>
      </p>
      <div style="text-align: center;">
        <form id="match-form">
          <button type="submit" id="start-match" style="
            margin-top: 20px; 
            padding: 10px 20px; 
            font-size: 1em; 
            background-color: #007BFF; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer;"
          >
            Start Match
          </button>
        </form>
      </div>
    `;
  }

  async addListeners() {
    document
      .getElementById("start-match")
      ?.addEventListener("submit", () => this.callGameView);
  }

  async render() {
    await this.updateHTML();
    this.addListeners();
  }

  private callGameView() {
    // console.log(
    //   `Match ${this.tournament.getMatchNumber()} started: ${this.player1} vs ${this.player2}`
    // );

    if (!this.player1 || !this.player2) {
      console.error("Player names are not set.");
      return;
    }

    const gameView = new GameView(
      this.player1,
      this.player2,
      GameType.tournament,
      this.tournament
    );
    gameView.render();
  }
}
