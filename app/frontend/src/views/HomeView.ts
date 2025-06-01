import AbstractView from "./AbstractView.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
  }

  createHTML() {
    return /* HTML */ `
      <h1>Home</h1>
      <p>Hello ${escapeHTML(auth.getToken().username)}!</p>
      <p>This is the home page</p>
    `;
  }

  async render() {
    this.updateHTML();
  }

  getName(): string {
    return "home";
  }
}
