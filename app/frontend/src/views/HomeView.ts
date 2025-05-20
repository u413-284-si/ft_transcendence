import AbstractView from "./AbstractView.js";
import { globalToken } from "../main.js";
import { escapeHTML } from "../utility.js";

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  createHTML() {
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <h1>Home</h1>
      <p>Hello ${escapeHTML(globalToken?.username) ?? "undefined"}!</p>
      <p>This is the home page</p>
      ${footerHTML}
    `;
  }

  async render() {
    this.updateHTML();
  }
}
