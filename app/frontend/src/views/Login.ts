import AbstractView from "./AbstractView.js";
import { navigateTo } from "../main.js";
import { ApiError } from "../services/api.js";
import { userLogin } from "../services/authServices.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { validateUsernameOrEmail } from "../validate.js";

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
						<input id="usernameOrEmail" name="usernameOrEmail" type="text" class="border-2 border-white rounded-sm" required>
					</div>
					<div>
						<label for="password">Password:</label><br>
						<input id="password" name="password" type="password" class="border-2 border-white rounded-sm" required>
					</div>
					<div>
						<button id="login-button" class="border-2 border-white rounded-sm p-2">Login</button>
					</div>
				</form>
			`;
  }

  async addListeners() {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    loginForm.addEventListener("submit", (event) =>
      validateAndLoginUser(event)
    );
  }

  async render() {
    await this.updateHTML();
    await this.addListeners();
  }
}

export async function validateAndLoginUser(event: Event): Promise<void> {
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
    if (error instanceof ApiError) {
      if (error.status === 401) {
        alert("Invalid username or password");
      }
    }
    console.error(error);
  }

  navigateTo("/home");
}
