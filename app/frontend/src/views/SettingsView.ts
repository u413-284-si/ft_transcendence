import AbstractView from "./AbstractView.js";

export default class SettingsView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Settings");
  }

  createHTML() {
    return `
			<h1>Settings</h1>
			<p>This is the Settings page</p>
			`;
  }

  async render() {
    this.updateHTML();
  }

  getName(): string {
    return "settings";
  }
}
