import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("New Tournament");
	}

	async createHTML() {
		const navbarHTML = await this.createNavbar();
		const footerHTML = await this.createFooter();
		return `
			${navbarHTML}
			<h1>New Tournament</h1>
			<p>This is the New Tournament page</p>
			${footerHTML}
			`;
	}

	async render() {
		await this.updateHTML();
	}
}