import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Stats");
	}

	async createHTML() {
		return `
			<h1>Stats</h1>
			<p>This is the Stats page</p>
			`;
	}

	async render() {
		await this.updateHTML();
	}
}