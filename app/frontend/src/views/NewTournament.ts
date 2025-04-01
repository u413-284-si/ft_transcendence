import AbstractView from "./AbstractView.js";
import { renderTournament } from "../tournament.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Tournament");
  }

  async createHTML() {
    return `
			<h1>New Tournament</h1>
            <p>Select the number of players:</p>
            <form id="tournament-form">
                <label>
                    <input type="radio" name="players" value="4" required> 4 Players
                </label><br>
                <label>
                    <input type="radio" name="players" value="8"> 8 Players
                </label><br>
                <label>
                    <input type="radio" name="players" value="16"> 16 Players
                </label><br>
                <button type="submit">Start Tournament</button>
            </form>
        `;
  }

  async addListeners() {
    document
      .getElementById("tournament-form")
      ?.addEventListener("submit", (event) => renderTournament(event));
  }

  async render() {
    await this.updateHTML();
    this.addListeners();
  }
}
