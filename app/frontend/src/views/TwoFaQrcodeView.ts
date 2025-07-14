import AbstractView from "./AbstractView.js";
// import { auth } from "../AuthManager.js";
// import { router } from "../routing/Router.js";
// import { addTogglePasswordListener, Input } from "../components/Input.js";
import { Button } from "../components/Button.js";
import { Form } from "../components/Form.js";
import { Paragraph } from "../components/Paragraph.js";
import { TextBox } from "../components/TextBox.js";
import { generateTwoFaQrcode } from "../services/authServices.js";
import { Image } from "../components/Image.js";
import { Input } from "../components/Input.js";

export default class TwoFaQrcodeView extends AbstractView {
  private qrCode: string = "";
  constructor() {
    super();
    this.setTitle("2FA QR Code");
  }

  createHTML() {
    return /* HTML */ `
      ${Form({
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
            text: "Submit",
            variant: "default",
            size: "md",
            type: "submit"
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
    await this.fetchData();
    this.addListeners();
    this.updateHTML();
  }

  getName(): string {
    return "two-fa-qrcode";
  }

  async fetchData() {
    this.qrCode = await generateTwoFaQrcode();
  }
}
