import AbstractView from "./AbstractView.js";
import { loginUser } from "../login.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  async createHTML() {
    return `
				<form id="login-form"  class="flex flex-col justify-center items-center h-screen gap-4">
					<div>
						<label for="usernameOrEmail">Username or Email:</label><br>
						<input id="usernameOrEmail" name="usernameOrEmail" type="text" class="border-2 border-white rounded-sm">
					</div>
					<div>
						<label for="password">Password:</label><br>
						<input id="password" name="password" type="text" class="border-2 border-white rounded-sm">
					</div>
					<div>
						<button id="login-button" class="border-2 border-white rounded-sm p-2">Login</button>
					</div>
				</form>
			`;
  }

  async addListeners() {
    document.addEventListener("submit", (event) => loginUser(event));
  }

  async render() {
    await this.addListeners();
    await this.updateHTML();
  }
}
