import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(
    private match: [string, string],
    private matchNumber: number
  ) {
    super();
    this.setTitle("Match Announcement");
  }

  async createHTML() {
    return `
      <h1 style="
        margin-bottom: 20px; 
        font-size: 2em; 
        color: #007BFF; 
        text-align: center;"
      >
        Match ${this.matchNumber}
      </h1>
      <p style="margin-bottom: 20px; text-align: center; font-size: 1.5em;">
        <strong>${this.match[0]}</strong> vs <strong>${this.match[1]}</strong>
      </p>
      <div style="text-align: center;">
        <button id="start-match" style="
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
      </div>
    `;
  }

  async addListeners() {
    document.getElementById("start-match")?.addEventListener("click", () => {
      console.log(
        `Match ${this.matchNumber} started: ${this.match[0]} vs ${this.match[1]}`
      );
      // Add logic to proceed to the match or next step
    });
  }

  async render() {
    await this.updateHTML();
    this.addListeners();
  }
}
