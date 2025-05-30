import AbstractView from "./AbstractView.js";

export default class SettingsView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Settings");
  }

  createHTML() {
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();
    return `
			${navbarHTML}
			<h1>Settings</h1>
			<p>This is the Settings page</p>
			${footerHTML}
			`;
  }

  async render() {
    this.updateHTML();
  }

  getName(): string {
    return "settings";
  }
}
