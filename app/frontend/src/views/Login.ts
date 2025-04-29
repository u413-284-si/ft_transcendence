import AbstractView from "./AbstractView.js";
import { ApiError } from "../services/api.js";
import { userLogin } from "../services/authServices.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { validateUsernameOrEmail } from "../validate.js";
import { navigateTo } from "../main.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  async createHTML() {
    return `
				<form id="login-form" class="flex flex-col justify-center items-center h-screen gap-4">
					<div>
						<label for="usernameOrEmail">Username or Email:</label><br>
						<input id="usernameOrEmail" name="usernameOrEmail" type="text" class="border-2 border-white rounded-sm">
					</div>
					<div>
						<label for="password">Password:</label><br>
						<input id="password" name="password" type="password" class="border-2 border-white rounded-sm">
					</div>
					<div>
						<button type="submit" class="border-2 border-white rounded-sm p-2">Login</button>
					</div>
				</form>
			`;
  }

  async addListeners() {
    document
      .getElementById("login-form")
      ?.addEventListener("submit", (event) => this.validateAndLoginUser(event));
  }

  async render() {
    await this.updateHTML();
    await this.addListeners();
  }

  async validateAndLoginUser(event: Event) {
    event.preventDefault();
    const loginForm: HTMLFormElement = document.getElementById(
      "login-form"
    ) as HTMLFormElement;
    const usernameOrEmail: string = loginForm.usernameOrEmail.value;
    const password: string = loginForm.password.value;

    if (!validateUsernameOrEmail(usernameOrEmail)) return;
    // FIXME: activate when password policy is applied
    // if (!validatePassword(password)) return;

    try {
      await userLogin(usernameOrEmail, password);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        alert("Invalid username or password");
      }
      console.error(error);
    }
    navigateTo("/home");
  }
}
