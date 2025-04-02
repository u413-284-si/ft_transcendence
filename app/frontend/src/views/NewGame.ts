import AbstractView from "./AbstractView.js";
import { renderGame } from "../game.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("New Game");
	}

	async createHTML() {
		const navbarHTML = await this.createNavbar();
		const footerHTML = await this.createFooter();
		return `
			${navbarHTML}
			<form id="register-form">
				<label for="nickname1">Player 1 Nickname:</label>
				<input type="text" id="nickname1" placeholder="Enter nickname"><br><br>
				<label for="nickname2">Player 2 Nickname:</label>
				<input type="text" id="nickname2" placeholder="Enter nickname"><br><br>
				<button id="start-button">Start Game</button>
			</form>
			<canvas id="gameCanvas" width="800" height="400" class="border-4 border-white"></canvas>
			${footerHTML}
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