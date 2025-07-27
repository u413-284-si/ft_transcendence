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
  removeTwoFa,
  verifyTwoFaCode
} from "../services/authServices.js";
import { auth } from "../AuthManager.js";
import {
  markInvalid,
  validatTwoFaCode as validateTwoFaCode
} from "../validate.js";
import { ApiError, getDataOrThrow } from "../services/api.js";
import { toaster } from "../Toaster.js";
import { router } from "../routing/Router.js";

export default class SettingsView extends AbstractView {
  private hasTwoFa: boolean = false;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";
  private isTwoFaGoingToBeRemoved: boolean = false;

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
                src: "",
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
      ?.addEventListener("click", () => this.displayTwoFaPasswordModal());
    document
      .getElementById("two-fa-password-form")
      ?.addEventListener("submit", (event) =>
        this.callPasswordFormAction(event)
      );
    document
      .getElementById("close-two-fa-modal-button")
      ?.addEventListener("click", () => this.hideTwoFaSetupModal());
    document
      .getElementById("close-two-fa-password-modal-button")
      ?.addEventListener("click", () => this.hideTwoFaPasswordModal());
    document
      .getElementById("two-fa-form")
      ?.addEventListener("submit", (event) => this.callTwoFaFormAction(event));
  }

  async render() {
    await this.fetchData();
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "settings";
  }

  private async callTwoFaFormAction(event: Event): Promise<void> {
    try {
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

        const apiResponse = await verifyTwoFaCode(twoFaQrCodeInput.value);
        if (!apiResponse.success) {
          if (apiResponse.status === 401) {
            markInvalid("Invalid code.", twoFaQrCodeInput, twoFaQrCodeErrorEl);
            return;
          } else {
            throw new ApiError(apiResponse);
          }
        }

      this.hideOverlay();
      this.hideTwoFaSetupModal();
      this.render();
      toaster.success("2FA setup successful");
    } else {
      this.hideTwoFaSetupModal();
      this.displayTwoFaPasswordModal();
      this.isTwoFaGoingToBeRemoved = true;
      }
    } catch (error) {
      router.handleError("Error in callTwoFaFormAction", error);
    }
  }

  private callPasswordFormAction(event: Event): void {
    if (this.isTwoFaGoingToBeRemoved) {
      this.removeTwoFa(event);
    } else {
      this.displayTwoFaSetup(event);
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
      this.isTwoFaGoingToBeRemoved = false;
      this.render();
      toaster.success("2FA removed successfully");
    } catch (error) {
      router.handleError("Error removing 2FA", error);
    }
  }

  private async displayTwoFaSetup(event: Event) {
    try {
      event.preventDefault();

      const twoFaPasswordInputEl = getInputEl("two-fa-password-input");
      const twoFaPasswordInputErrorEl = getEl("two-fa-password-input-error");
      // FIXME: activate when password policy is applied
      // if (!validatePassword(twoFaPasswordInputEl, twoFaPasswordInputErrorEl))
      //   return;

      const apiResponse = await generateTwoFaQrcode(twoFaPasswordInputEl.value);
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
      const { qrcode } = apiResponse.data;

      const twoFaQrCodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
      twoFaQrCodeEl.src = qrcode;

      this.hideOverlay();
      this.hideTwoFaPasswordModal();
      this.displayTwoFaSetupModal();
    } catch (error) {
      router.handleError("Error displaying 2FA setup", error);
    }
  }

  private displayTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    twoFaModal.classList.remove("hidden");
    this.displayOverlay();
  }

  private hideTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    const twoFaQrCodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
    twoFaQrCodeEl.src = "";
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
}
