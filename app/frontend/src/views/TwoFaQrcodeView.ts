import AbstractView from "./AbstractView.js";
// import { auth } from "../AuthManager.js";
// import { router } from "../routing/Router.js";
// import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { Paragraph } from "../components/Paragraph.js";

export default class TwoFaQrcodeView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Login");
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
        children: [
          Paragraph({
            text: "You have to activate 2FA for your account. Please use an authenticator app (eg. Google Authenticator) to scan the QR code below:"
          })
        ],
        id: "two-fa-form"
      })}
    `;
  }

  protected addListeners() {
    // document
    //   .getElementById("login-form")
    //   ?.addEventListener("submit", (event) => this.validateAndLoginUser(event));
    // addTogglePasswordListener("password");
    // document
    //   .getElementById("google-login")
    //   ?.addEventListener("click", () => auth.loginWithGoogle());
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "two-fa";
  }
}
