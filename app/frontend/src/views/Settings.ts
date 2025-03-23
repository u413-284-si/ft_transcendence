import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Settings");
	}

	async createHTML() {
		return `
			<h1>Settings</h1>
			<p>This is the Settings page</p>
			`;
	}

	async render() {
		await this.updateHTML();
	}
}