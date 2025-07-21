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
import {
  generateTwoFaQrcode,
  getTwoFaStatus
} from "../services/authServices.js";
import { auth } from "../AuthManager.js";
import { validateTwoFaCode } from "../validate.js";
import { getDataOrThrow } from "../services/api.js";
import { toaster } from "../Toaster.js";

export default class SettingsView extends AbstractView {
  private qrCode: string = "";
  private hasTwoFa: boolean = false;

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
                  !this.hasTwoFa
                    ? TextBox({
                        id: "two-fa-qr-code-info",
                        text: [
                          "Activate 2FA:",
                          "",
                          "please use an authenticator app",
                          "to scan the QR code below."
                        ],
                        variant: "info",
                        size: "sm"
                      })
                    : TextBox({
                        id: "two-fa-qr-code-info",
                        text: [
                          "Deactivate 2FA:",
                          "",
                          "By deactivating 2FA, you will remove your current 2FA setup."
                        ],
                        variant: "warning",
                        size: "sm"
                      }),
                  Image({
                    id: "two-fa-qr-code",
                    src: this.qrCode,
                    alt: "QR Code"
                  }),
                  !this.hasTwoFa
                    ? Input({
                        id: "two-fa-qr-code-input",
                        label: "Enter code",
                        name: "two-fa-qr-code-input",
                        type: "text",
                        placeholder: "Code",
                        errorId: "two-fa-qr-code-input-error"
                      })
                    : "",
                  !this.hasTwoFa
                    ? Button({
                        id: "two-fa-submit",
                        text: "Activate",
                        variant: "default",
                        size: "md",
                        type: "submit"
                      })
                    : Button({
                        id: "two-fa-remove",
                        text: "Deactivate",
                        variant: "danger",
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
    document
      .getElementById("two-fa-form")
      ?.addEventListener("submit", (event) =>
        this.validateAndSetupTwoFa(event)
      );
  }

  async render() {
    await this.fetchData();
    this.updateHTML();
    this.setData();
    this.addListeners();
  }

  getName(): string {
    return "settings";
  }

  private displayTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.remove("hidden");
    this.displayOverlay();
  }

  private hideTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.add("hidden");
    this.hideOverlay();
  }

  private async validateAndSetupTwoFa(event: Event): Promise<void> {
    event.preventDefault();
    const twoFaQrCodeInput = getEl("two-fa-qr-code-input") as HTMLInputElement;
    const twoFaQrCodeErrorEl = getEl("two-fa-qr-code-input-error");

    const isTwoFaCodeValid = await validateTwoFaCode(
      twoFaQrCodeInput,
      twoFaQrCodeErrorEl
    );
    if (!isTwoFaCodeValid) {
      return;
    }
    this.hideOverlay();
    this.hideTwoFaSetupModal();
    toaster.success("2FA setup successful");
  }

  private displayOverlay(): void {
    const overlay = document.getElementById("overlay-root");
    overlay?.classList.remove("hidden");
  }

  private hideOverlay(): void {
    const overlay = document.getElementById("overlay-root");
    overlay?.classList.add("hidden");
  }

  private async fetchData(): Promise<void> {
    this.qrCode = getDataOrThrow(await generateTwoFaQrcode());
    this.hasTwoFa = getDataOrThrow(await getTwoFaStatus()).hasTwoFa;
  }

  private setData() {
    const twoFaQrcodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
    twoFaQrcodeEl.src = this.qrCode;
  }
}
