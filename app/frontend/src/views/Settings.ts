import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Settings");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return `
			${navbarHTML}
			<h1>Settings</h1>
			<p>This is the Settings page</p>
			${footerHTML}
			`;
  }

  async render() {
    await this.updateHTML();
  }
}
