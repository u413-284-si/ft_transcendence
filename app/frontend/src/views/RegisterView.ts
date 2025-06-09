import AbstractView from "./AbstractView.js";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword
} from "../validate.js";
import { registerUser } from "../services/userServices.js";
import { router } from "../routing/Router.js";
import { ApiError } from "../services/api.js";
import { getEl, getInputEl } from "../utility.js";

export default class Register extends AbstractView {
  constructor() {
    super();
    this.setTitle("Register");
  }

  private getShowEyeHtml(): string {
    return /* HTML */ `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    `;
  }

  private getHideEyeHtml(): string {
    return /* HTML */ ` <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>`;
  }

  createHTML(): string {
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
          <div class="relative flex items-center">
            <input
              id="password"
              name="password"
              type="password"
              class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
            />
            <button
              type="button"
              id="password-toggle"
              class="absolute right-2 p-2 text-gray-300 hover:text-gray-50"
            >
              <span id="show-eye"> ${this.getShowEyeHtml()} </span>
              <span id="hide-eye" class="hidden">
                ${this.getHideEyeHtml()}
              </span>
            </button>
          </div>
          <span
            id="password-error"
            class="error-message text-red-600 text-sm mt-1 hidden"
          ></span>
        </div>
        <div class="w-[300px]">
          <label for="confirm-password">Confirm Password:</label><br />
          <div class="relative flex items-center">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              class="w-full border border-gray-300 rounded px-2 py-1 transition-all duration-300"
            />
            <button
              type="button"
              id="confirm-password-toggle"
              class="absolute right-2 p-2 text-gray-300 hover:text-gray-50"
            >
              <span id="confirm-show-eye"> ${this.getShowEyeHtml()} </span>
              <span id="confirm-hide-eye" class="hidden">
                ${this.getHideEyeHtml()}
              </span>
            </button>
          </div>
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

  protected addListeners(): void {
    document
      .getElementById("register-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndRegisterUser(event)
      );

    const passwordEl = getInputEl("password");
    const confirmPasswordEl = getInputEl("confirm-password");

    const showEyeEl = getEl("show-eye");
    const hideEyeEl = getEl("hide-eye");

    const confirmShowEyeEl = getEl("confirm-show-eye");
    const confirmHideEyeEl = getEl("confirm-hide-eye");

    document
      .getElementById("password-toggle")
      ?.addEventListener("click", () =>
        this.togglePasswordVisibility(passwordEl, showEyeEl, hideEyeEl)
      );
    document
      .getElementById("confirm-password-toggle")
      ?.addEventListener("click", () =>
        this.togglePasswordVisibility(
          confirmPasswordEl,
          confirmShowEyeEl,
          confirmHideEyeEl
        )
      );
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "register";
  }

  private togglePasswordVisibility(
    passwordEl: HTMLInputElement,
    showEyeEl: HTMLElement,
    hideEyeEl: HTMLElement
  ): void {
    if (passwordEl.type === "password") {
      passwordEl.type = "text";
      showEyeEl.classList.add("hidden");
      hideEyeEl.classList.remove("hidden");
    } else {
      passwordEl.type = "password";
      showEyeEl.classList.remove("hidden");
      hideEyeEl.classList.add("hidden");
    }
  }

  private async validateAndRegisterUser(event: Event): Promise<void> {
    event.preventDefault();
    const emailEL = getInputEl("email");
    const emailErrorEl = getEl("email-error");

    const userEl = getInputEl("username");
    const userErrorEl = getEl("username-error");

    const passwordEl = getInputEl("password");
    const passwordErrorEl = getEl("password-error");

    const confirmPasswordEl = getInputEl("confirm-password");
    const confirmPasswordErrorEl = getEl("confirm-password-error");

    const isEmailValid = validateEmail(emailEL, emailErrorEl);
    const isUsernameValid = validateUsername(userEl, userErrorEl);
    const isPasswordValid = validatePassword(passwordEl, passwordErrorEl);
    const isConfirmPasswordValid = validateConfirmPassword(
      passwordEl,
      confirmPasswordEl,
      confirmPasswordErrorEl
    );

    if (
      !isEmailValid ||
      !isUsernameValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    try {
      await registerUser(emailEL.value, userEl.value, passwordEl.value);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        alert("Email or username already exists");
        return;
      }
    }
    alert("Registration was successful!");
    router.navigate("/login", false);
  }
}
