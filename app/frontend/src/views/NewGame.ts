import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("New Game");
	}

	async getHTML() {
		return `
			<form>
				<label for="nickname1">Player 1 Nickname:</label>
				<input type="text" id="nickname1" placeholder="Enter nickname"><br><br>
				<label for="nickname2">Player 2 Nickname:</label>
				<input type="text" id="nickname2" placeholder="Enter nickname"><br><br>
				<button id="start-button">Start Game</button>
			</form>
			`;
	}
}