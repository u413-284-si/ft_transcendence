import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { Modal } from "../components/Modal.js";
import { Form } from "../components/Form.js";
import { TextBox } from "../components/TextBox.js";
import { Input } from "../components/Input.js";
import { Image } from "../components/Image.js";
import { getEl } from "../utility.js";
import { generateTwoFaQrcode } from "../services/authServices.js";
import { auth } from "../AuthManager.js";

export default class SettingsView extends AbstractView {
  private qrCode: string = "";
  private username: string = auth.getUser().username;

  constructor() {
    super();
    this.setTitle("Settings");
  }

  createHTML() {
    return /* HTML */ `
      <div class="text-center space-y-4">
        ${Header1({
          text: "Settings",
          variant: "default"
        })}
        ${Paragraph({
          text: "Configure your preferences and settings here.",
          id: "settings-intro"
        })}
        ${Button({
          id: "setup-two-fa-button",
          text: "Setup 2FA",
          variant: "default",
          type: "button"
        })}
          ${Modal({
            id: "two-fa-modal",
            children: [
              Form({
                children: [
                  TextBox({
                    id: "two-fa-qr-code-info",
                    text: [
                      "Activate 2FA:",
                      "",
                      "please use an authenticator app",
                      "to scan the QR code below."
                    ],
                    variant: "info",
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
					placeholder: "Code",
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
          })}
        </div>
      </div>
    `;
  }

  protected addListeners(): void {
    document
      .getElementById("setup-two-fa-button")
      ?.addEventListener("click", () => this.displayTwoFaSetupModal());
    document
      .getElementById("close-modal-button")
      ?.addEventListener("click", () => this.hideTwoFaSetupModal());
  }

  async render() {
    this.updateHTML();
    await this.fetchData(this.username);
    this.addListeners();
  }

  getName(): string {
    return "settings";
  }

  private displayTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.remove("hidden");
  }

  private hideTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.add("hidden");
  }

  private async fetchData(username: string): Promise<void> {
    this.qrCode = await generateTwoFaQrcode(username);
    console.log(this.qrCode);
    const twoFaQrcodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
    twoFaQrcodeEl.src = this.qrCode;
  }
}
