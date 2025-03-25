import AbstractView from "./AbstractView.js";
import { renderGame } from "../game.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("New Game");
	}

	async createHTML() {
		return `
			<form id="register-form">
				<label for="nickname1">Player 1 Nickname:</label>
				<input type="text" id="nickname1" placeholder="Enter nickname"><br><br>
				<label for="nickname2">Player 2 Nickname:</label>
				<input type="text" id="nickname2" placeholder="Enter nickname"><br><br>
				<button id="start-button">Start Game</button>
			</form>
			<canvas id="gameCanvas" width="800" height="400" class="border-4 border-white"></canvas>
			`;
	}

	async addListeners() {
		document.getElementById("start-button")?.addEventListener("click", (event) => renderGame(event));
	}

	async render() {
		await this.updateHTML();
		this.addListeners();
	}
}