import AbstractView from "./AbstractView.js";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
} from "../validate.js";
import { registerUser } from "../services/userServices.js";
import { router } from "../routing/Router.js";
import { ApiError } from "../services/api.js";
import { escapeHTML, getEl, getInputEl } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { toaster } from "../Toaster.js";

export default class Register extends AbstractView {
  constructor() {
    super();
    this.setTitle("Register");
  }

  createHTML(): string {
    return /* HTML */ ` ${Form({
      children: [
        Header1({
          text: "Register Here",
          variant: "default"
        }),
        Input({
          id: "email",
          label: "Email",
          name: "email",
          placeholder: "Email",
          type: "email",
          errorId: "email-error"
        }),
        Input({
          id: "username",
          label: "Username",
          name: "username",
          placeholder: "Username",
          type: "text",
          errorId: "username-error"
        }),
        Input({
          id: "password",
          label: "Password",
          name: "password",
          placeholder: "Password",
          type: "password",
          errorId: "password-error",
          hasToggle: true
        }),
        Input({
          id: "confirm",
          label: "Confirm Password",
          name: "confirm",
          placeholder: "Confirm Password",
          type: "password",
          errorId: "confirm-error",
          hasToggle: true
        }),
        Button({
          text: "Register",
          variant: "default",
          size: "md",
          type: "submit"
        })
      ],
      id: "register-form"
    })}`;
  }

  protected addListeners(): void {
    document
      .getElementById("register-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndRegisterUser(event)
      );

    addTogglePasswordListener("password");
    addTogglePasswordListener("confirm");
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "register";
  }

  private async validateAndRegisterUser(event: Event): Promise<void> {
    event.preventDefault();
    const emailEL = getInputEl("email");
    const emailErrorEl = getEl("email-error");

    const userEl = getInputEl("username");
    const userErrorEl = getEl("username-error");

    const passwordEl = getInputEl("password");
    const passwordErrorEl = getEl("password-error");

    const confirmPasswordEl = getInputEl("confirm");
    const confirmPasswordErrorEl = getEl("confirm-error");

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
      const apiResponse = (await registerUser(emailEL.value, userEl.value, passwordEl.value));
      if (!apiResponse.success) {
        if (apiResponse.status === 409) {
          toaster.error("Email or username already exists");
          return;
        } else throw new ApiError(apiResponse);
      }
      const username = escapeHTML(apiResponse.data.username);
      toaster.success(`Successfully registered ${username}`);
      router.navigate("/login", false);
    } catch (error) {
      router.handleError("validateAndRegisterUser()", error);
    }
  }
}
