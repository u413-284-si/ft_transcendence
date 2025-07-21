import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { Modal } from "../components/Modal.js";
import { Form } from "../components/Form.js";
import { TextBox } from "../components/TextBox.js";
import { Input } from "../components/Input.js";
import { Image } from "../components/Image.js";
import { getEl, getInputEl } from "../utility.js";
import {
  generatTwoFaQrcode,
  geTwoFaStatus,
  removeTwoFa
} from "../services/authServices.js";
import { auth } from "../AuthManager.js";
import {
  markInvalid,
  validatePassword,
  validatTwoFaCode
} from "../validate.js";
import { ApiError, getDataOrThrow } from "../services/api.js";
import { toaster } from "../Toaster.js";

export default class SettingsView extends AbstractView {
  private qrCode: string = "";
  private haTwoFa: boolean = false;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  constructor() {
    super();
    this.setTitle("Settings");
  }

  private get2FaSetupHTML(): string {
    return /* HTML */ `
      ${Button({
        id: "setup-two-fa-button",
        text: "Setup 2FA",
        variant: "default",
        type: "button"
      })}
      ${Modal({
        id: "two-fa-modal",
        idCloseButton: "close-two-fa-modal-button",
        children: [
          Form({
            children: [
              !this.haTwoFa
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
                    text: ["2FA activated"],
                    variant: "info",
                    size: "sm"
                  }),
              Image({
                id: "two-fa-qr-code",
                src: this.qrCode,
                alt: "QR Code"
              }),
              !this.haTwoFa
                ? Input({
                    id: "two-fa-qr-code-input",
                    label: "Enter code",
                    name: "two-fa-qr-code-input",
                    type: "text",
                    placeholder: "Code",
                    errorId: "two-fa-qr-code-input-error"
                  })
                : "",
              !this.haTwoFa
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
      ${Modal({
        id: "two-fa-password-modal",
        idCloseButton: "close-two-fa-password-modal-button",
        children: [
          Form({
            id: "two-fa-password-form",
            children: [
              Input({
                id: "two-fa-password-input",
                label: "Password",
                name: "two-fa-password-input",
                placeholder: "Password",
                type: "password",
                errorId: "two-fa-password-input-error",
                hasToggle: true
              }),
              Button({
                id: "two-fa-submit-password",
                text: "Confirm",
                variant: "default",
                size: "md",
                type: "submit"
              })
            ]
          })
        ]
      })}
    `;
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
		${this.hasLocalAuth ? this.get2FaSetupHTML() : ""}
        </div>
      </div>
    `;
  }

  protected addListeners(): void {
    document
      .getElementById("setup-two-fa-button")
      ?.addEventListener("click", () => this.displaTwoFaSetupModal());
    document
      .getElementById("close-two-fa-modal-button")
      ?.addEventListener("click", () => this.hidTwoFaSetupModal());
    if (this.haTwoFa) {
      document
        .getElementById("close-two-fa-password-modal-button")
        ?.addEventListener("click", () => this.hidTwoFaPasswordModal());
      document
        .getElementById("two-fa-password-form")
        ?.addEventListener("submit", (event) => this.removTwoFa(event));
    }
    document
      .getElementById("two-fa-form")
      ?.addEventListener("submit", (event) => this.twoFaAction(event));
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

  private async displaTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.remove("hidden");
    this.displayOverlay();
  }

  private hidTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.add("hidden");
    this.hideOverlay();
  }

  private displaTwoFaPasswordModal() {
    const twoFaModal = getEl("two-fa-password-modal");
    twoFaModal.classList.remove("hidden");
    this.displayOverlay();
  }

  private hidTwoFaPasswordModal() {
    const twoFaModal = getEl("two-fa-password-modal");
    twoFaModal.classList.add("hidden");
    this.hideOverlay();
  }

  private async twoFaAction(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.haTwoFa) {
      const twoFaQrCodeInput = getEl(
        "two-fa-qr-code-input"
      ) as HTMLInputElement;
      const twoFaQrCodeErrorEl = getEl("two-fa-qr-code-input-error");

      const iTwoFaCodeValid = await validatTwoFaCode(
        twoFaQrCodeInput,
        twoFaQrCodeErrorEl
      );
      if (!iTwoFaCodeValid) {
        return;
      }
      this.hideOverlay();
      this.hidTwoFaSetupModal();
      this.render();
      toaster.success("2FA setup successful");
    } else {
      this.hidTwoFaSetupModal();
      this.displaTwoFaPasswordModal();
    }
  }

  private async removTwoFa(event: Event): Promise<void> {
    event.preventDefault();

    const twoFaPasswordInputEl = getInputEl("two-fa-password-input");
    const twoFaPasswordInputErrorEl = getEl("two-fa-password-input-error");
    // FIXME: activate when password policy is applied
    // if (!validatePassword(twoFaPasswordInputEl, twoFaPasswordInputErrorEl))
    //   return;
    const apiResponse = await removeTwoFa(twoFaPasswordInputEl.value);
    console.log(apiResponse);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid(
          "Invalid password.",
          twoFaPasswordInputEl,
          twoFaPasswordInputErrorEl
        );
        return;
      } else {
        throw new ApiError(apiResponse);
      }
    }
    this.hidTwoFaPasswordModal();
    this.hideOverlay();
    this.render();
    toaster.success("2FA removed successfully");
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
    this.haTwoFa = getDataOrThrow(await geTwoFaStatus()).haTwoFa;
    if (this.haTwoFa) this.qrCode = getDataOrThrow(await generatTwoFaQrcode());
  }

  private setData() {
    if (this.haTwoFa) {
      const twoFaQrcodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
      twoFaQrcodeEl.src = this.qrCode;
    }
  }
}
