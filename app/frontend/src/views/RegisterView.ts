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
import { escapeHTML, getEl, getInputEl } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Input, addTogglePasswordListener } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { toaster } from "../Toaster.js";

export default class Register extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("registerView.title"));
  }

  createHTML(): string {
    return /* HTML */ `
      ${Form({
        children: [
          Header1({
            text: i18next.t("registerView.register"),
            variant: "default"
          }),
          Input({
            id: "email",
            label: i18next.t("global.label", {
              field: i18next.t("global.email")
            }),
            name: "email",
            placeholder: i18next.t("global.email"),
            type: "email",
            errorId: "email-error"
          }),
          Input({
            id: "username",
            label: i18next.t("global.label", {
              field: i18next.t("global.username")
            }),
            name: "username",
            placeholder: i18next.t("global.username"),
            type: "text",
            errorId: "username-error"
          }),
          Input({
            id: "password",
            label: i18next.t("global.label", {
              field: i18next.t("global.password")
            }),
            name: "password",
            placeholder: i18next.t("global.password"),
            type: "password",
            errorId: "password-error",
            hasToggle: true
          }),
          Input({
            id: "confirm",
            label: i18next.t("global.label", {
              field: i18next.t("global.confirmNewPassword")
            }),
            name: "confirm",
            placeholder: i18next.t("global.confirmNewPassword"),
            type: "password",
            errorId: "confirm-error",
            hasToggle: true
          }),
          Button({
            text: i18next.t("registerView.register"),
            variant: "default",
            size: "md",
            type: "submit"
          })
        ],
        id: "register-form"
      })}
    `;
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
      const apiResponse = await registerUser(
        emailEL.value,
        userEl.value,
        passwordEl.value
      );
      if (!apiResponse.success) {
        if (apiResponse.status === 409) {
          toaster.error(i18next.t("toast.emailOrUsernameExists"));
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      emailEL.value = "";
      userEl.value = "";
      passwordEl.value = "";
      const username = escapeHTML(apiResponse.data.username);
      toaster.success(
        i18next.t("toast.registrationSuccess", {
          username: username
        })
      );
    } catch (error) {
      router.handleError("validateAndRegisterUser()", error);
    }
  }
}
