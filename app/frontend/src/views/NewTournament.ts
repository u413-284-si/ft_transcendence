import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("New Tournament");
	}

	async getHTML() {
		return `
			<h1>New Tournament</h1>
			<p>This is the New Tournament page</p>
			`;
	}
}