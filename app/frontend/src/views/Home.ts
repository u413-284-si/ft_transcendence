import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
	}

	async createHTML() {
		const navbarHTML = await this.createNavbar();
		const footerHTML = await this.createFooter();
		return `
			${navbarHTML}
			<h1>Home</h1>
			<p>This is the home page</p>
			${footerHTML}
			`;
	}

	async render() {
		await this.updateHTML();
	}
}