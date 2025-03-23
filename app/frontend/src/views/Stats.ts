import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Stats");
	}

	async getHTML() {
		return `
			<h1>Stats</h1>
			<p>This is the Stats page</p>
			`;
	}
}