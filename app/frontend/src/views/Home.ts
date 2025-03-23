import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async createHTML() {
		return `
			<h1>Home</h1>
			<p>This is the home page</p>
			`;
	}

	async render() {
		await this.updateHTML();
	}
}