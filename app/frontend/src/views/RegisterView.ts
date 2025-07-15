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
import { Header1 } from "../components/Header1.js";
import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { toaster } from "../Toaster.js";
import { Modal } from "../components/Modal.js";
import { TextBox } from "../components/TextBox.js";
import { Image } from "../components/Image.js";
import { generateTwoFaQrcode } from "../services/authServices.js";

export default class Register extends AbstractView {
  private qrCode: string = "";
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
    })}
    ${Modal({
      id: "two-fa-modal",
      children: [
        Form({
          children: [
            TextBox({
              id: "two-fa-qr-code-info",
              text: [
                "You have to active 2FA for your account.",
                "",
                "Please use an authenticator app",
                "to scan the QR code below."
              ],
              variant: "warning",
              size: "sm"
            }),
            Image({
              id: "two-fa-qr-code",
              src: this.qrCode,
              alt: "QR Code"
            }),
            Input({
              id: "two-fa-qr-code-input",
              label: "Enter code",
              name: "two-fa-qr-code-input",
              type: "text",
              errorId: "two-fa-qr-code-input-error"
            }),
            Button({
              id: "two-fa-submit",
              text: "Submit",
              variant: "default",
              size: "md",
              type: "submit"
            })
          ],
          id: "two-fa-form"
        })
      ]
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

    await this.fetchData(userEl.value);
    console.log(this.qrCode);
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.remove("hidden");

    try {
      //   await registerUser(emailEL.value, userEl.value, passwordEl.value);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toaster.error("Email or username already exists");
        return;
      }
    }
  }

  private async fetchData(username: string): Promise<void> {
    this.qrCode = await generateTwoFaQrcode(username);
    const twoFaQrcodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
    twoFaQrcodeEl.src = this.qrCode;
  }
}
