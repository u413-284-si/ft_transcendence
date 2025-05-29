import AbstractView from "./AbstractView.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword
} from "../validate.js";
import { registerUser } from "../services/userServices.js";
import { router } from "../routing/Router.js";

export default class LoginView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  createHTML() {
    return /* HTML */ `
      <form
        id="register-form"
        class="flex flex-col justify-center items-center gap-4"
      >
        <h1>Register Here</h1>
        <div class="w-[300px]">
          <label for="email">Email</label><br />
          <input
            id="email"
            name="email"
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
          />
          <span
            id="email-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <div class="w-[300px]">
          <label for="username">Username</label><br />
          <input
            id="username"
            name="username"
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
          />
          <span
            id="username-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <div class="w-[300px]">
          <label for="password">Password:</label><br />
          <input
            id="password"
            name="password"
            type="password"
            class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
          />
          <span
            id="password-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <div class="w-[300px]">
          <label for="confirm-password">Confirm Password:</label><br />
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
          />
          <span
            id="confirm-password-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <div>
          <button type="submit" class="border-2 border-white rounded-sm p-2">
            Register
          </button>
        </div>
      </form>
    `;
  }

  protected addListeners() {
    document
      .getElementById("register-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndRegisterUser(event)
      );
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "register";
  }

  private async validateAndRegisterUser(event: Event) {
    event.preventDefault();
    const emailEL = document.getElementById("email") as HTMLInputElement;
    const emailErrorEl = document.getElementById("email-error") as HTMLElement;

    const userEl = document.getElementById("username") as HTMLInputElement;
    const userErrorEl = document.getElementById(
      "username-error"
    ) as HTMLElement;

    const passwordEl = document.getElementById("password") as HTMLInputElement;
    const passwordErrorEl = document.getElementById(
      "password-error"
    ) as HTMLElement;

    const confirmPasswordEl = document.getElementById(
      "confirm-password"
    ) as HTMLInputElement;
    const confirmPasswordErrorEl = document.getElementById(
      "confirm-password-error"
    ) as HTMLElement;

    if (
      !validateEmail(emailEL, emailErrorEl) ||
      !validateUsername(userEl, userErrorEl) ||
      !validatePassword(passwordEl, passwordErrorEl) ||
      !validateConfirmPassword(
        passwordEl,
        confirmPasswordEl,
        confirmPasswordErrorEl
      )
    )
      return;

    await registerUser(emailEL.value, userEl.value, passwordEl.value);
    router.navigate("/login", false);
  }
}
