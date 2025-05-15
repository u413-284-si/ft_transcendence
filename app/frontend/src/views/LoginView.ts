import AbstractView from "./AbstractView.js";
import { ApiError } from "../services/api.js";
import { userLogin } from "../services/authServices.js";
// FIXME: activate when password policy is applied
//import { validatePassword, validateUsernameOrEmail } from "../validate.js";
import { validateUsernameOrEmail } from "../validate.js";
import { navigateTo } from "../main.js";

export default class LoginView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  createHTML() {
    return /* HTML */ `
      <form
        id="login-form"
        class="flex flex-col justify-center items-center h-screen gap-4"
      >
        <div class="w-[300px]">
          <label for="usernameOrEmail">Username or Email:</label><br />
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
          />
          <span
            id="usernameOrEmail-error"
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
        <div>
          <button type="submit" class="border-2 border-white rounded-sm p-2">
            Login
          </button>
        </div>
      </form>
    `;
  }

  protected addListeners() {
    document
      .getElementById("login-form")
      ?.addEventListener("submit", (event) => this.validateAndLoginUser(event));
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  async validateAndLoginUser(event: Event) {
    event.preventDefault();
    const userEl = document.getElementById(
      "usernameOrEmail"
    ) as HTMLInputElement;
    const userErrorEl = document.getElementById(
      "usernameOrEmail-error"
    ) as HTMLElement;
    const passwordEl = document.getElementById("password") as HTMLInputElement;
    // FIXME: activate when password policy is applied
    // const passwordErrorEl = document.getElementById(
    //   "password-error"
    // ) as HTMLElement;

    if (!validateUsernameOrEmail(userEl, userErrorEl)) return;
    // FIXME: activate when password policy is applied
    // if (!validatePassword(passwordEl, passwordErrorEl)) return;

    try {
      await userLogin(userEl.value, passwordEl.value);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        alert("Invalid username or password");
      }
      console.error(error);
    }
    navigateTo("/home");
  }
}
