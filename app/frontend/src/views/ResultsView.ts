import AbstractView from "./AbstractView.js";

export default class ResultsView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Results");
  }

  async createHTML() {
    return `
      <h1>Results</h1>
      <p>This is the Results page</p>
      `;
  }

  async render() {
    await this.updateHTML();
  }
}
