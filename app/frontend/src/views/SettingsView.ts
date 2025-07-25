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
  generateTwoFaQrcode as generateTwoFaQrcode,
  geTwoFaStatus,
  removeTwoFa
} from "../services/authServices.js";
import { auth } from "../AuthManager.js";
import {
  markInvalid,
  validatePassword,
  validatTwoFaCode as validateTwoFaCode
} from "../validate.js";
import { ApiError, getDataOrThrow } from "../services/api.js";
import { toaster } from "../Toaster.js";
import { router } from "../routing/Router.js";

export default class SettingsView extends AbstractView {
  private hasTwoFa: boolean = false;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  constructor() {
    super();
    this.setTitle("Settings");
  }

  private async get2FaSetupHTML(): Promise<string | undefined> {
    try {
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
                      text: ["2FA activated"],
                      variant: "info",
                      size: "sm"
                    }),
                Image({
                  id: "two-fa-qr-code",
                  src: getDataOrThrow(await generateTwoFaQrcode()).qrcode,
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
    } catch (error) {
      router.handleError("Error getting 2FA setup", error);
    }
  }

  private createTwoFaPlaceholder(): string {
    return /* HTML */ ` <div id="two-fa-placeholder"></div> `;
  }

  createHTML() {
    const twoFaPlaceholder = this.hasLocalAuth
      ? this.createTwoFaPlaceholder()
      : "";
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
		${twoFaPlaceholder}
        </div>
      </div>
    `;
  }

  protected addListeners(): void {
    document
      .getElementById("setup-two-fa-button")
      ?.addEventListener("click", () => this.displayTwoFaSetupModal());
    document
      .getElementById("close-two-fa-modal-button")
      ?.addEventListener("click", () => this.hideTwoFaSetupModal());
    if (this.hasTwoFa) {
      document
        .getElementById("close-two-fa-password-modal-button")
        ?.addEventListener("click", () => this.hideTwoFaPasswordModal());
      document
        .getElementById("two-fa-password-form")
        ?.addEventListener("submit", (event) => this.removeTwoFa(event));
    }
    document
      .getElementById("two-fa-form")
      ?.addEventListener("submit", (event) => this.twoFaAction(event));
  }

  async render() {
    await this.fetchData();
    this.updateHTML();
    await this.setData();
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

  private displayTwoFaPasswordModal() {
    const twoFaModal = getEl("two-fa-password-modal");
    twoFaModal.classList.remove("hidden");
    this.displayOverlay();
  }

  private hideTwoFaPasswordModal() {
    const twoFaModal = getEl("two-fa-password-modal");
    twoFaModal.classList.add("hidden");
    this.hideOverlay();
  }

  private async twoFaAction(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.hasTwoFa) {
      const twoFaQrCodeInput = getEl(
        "two-fa-qr-code-input"
      ) as HTMLInputElement;
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
      this.render();
      toaster.success("2FA setup successful");
    } else {
      this.hideTwoFaSetupModal();
      this.displayTwoFaPasswordModal();
    }
  }

  private async removeTwoFa(event: Event): Promise<void> {
    try {
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
      this.hideTwoFaPasswordModal();
      this.hideOverlay();
      this.render();
      toaster.success("2FA removed successfully");
    } catch (error) {
      router.handleError("Error removing 2FA", error);
    }
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
    try {
      if (this.hasLocalAuth)
        this.hasTwoFa = getDataOrThrow(await geTwoFaStatus()).hasTwoFa;
    } catch (error) {
      router.handleError("Error fetching data", error);
    }
  }

  private async setData() {
    try {
      if (this.hasLocalAuth) {
        const twoFaPlaceholderEL = getEl("two-fa-placeholder");
        if (twoFaPlaceholderEL) {
          twoFaPlaceholderEL.innerHTML = (await this.get2FaSetupHTML()) ?? "";
        }
      }
    } catch (error) {
      router.handleError("Error setting data", error);
    }
  }
}
