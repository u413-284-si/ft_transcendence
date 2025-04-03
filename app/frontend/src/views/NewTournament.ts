import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("New Tournament");
  }

  async createHTML() {
    return `
			<h1>New Tournament</h1>
			<p>This is the New Tournament page</p>
			`;
  }

  async render() {
    await this.updateHTML();
  }
}
