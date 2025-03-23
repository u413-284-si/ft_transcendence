import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("New Game");
	}

	async getHTML() {
		return `
			<h1>New Game</h1>
			<p>This is the New Game page</p>
			`;
	}
}