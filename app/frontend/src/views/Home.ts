import AbstractView from "./AbstractView.js";
import { globalToken } from "../main.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <h1>Home</h1>
      <p>Hello ${globalToken?.username ?? "undefined"}!</p>
      <p>This is the home page</p>
      ${footerHTML}
    `;
  }

  async render() {
    await this.updateHTML();
  }
}
