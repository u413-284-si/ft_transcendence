import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async getHTML() {
		return `
			<h1>Home</h1>
			<p>This is the home page</p>
			`;
	}
}