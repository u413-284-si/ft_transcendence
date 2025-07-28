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
  generateBackupCodes,
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
import { Link } from "../components/Link.js";
import { Table } from "../components/Table.js";

export default class SettingsView extends AbstractView {
  private hasTwoFa: boolean = false;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  private passwordFormAction: "setup" | "remove" | "backupCodes" = "setup";

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
                    id: "generate-backup-codes",
                    text: "Generate Backup Codes",
                    type: "button"
                  }),
              Button({
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
      ${Modal({
        id: "two-fa-backup-codes-modal",
        idCloseButton: "two-fa-close-backup-codes-modal-button",
        children: [
          TextBox({
            id: "two-fa-backup-codes-info",
            text: [
              "Those are your backup codes.",
              "Copy or download them",
              "",
              "THEY WILL NOT BE SHOWN AGAIN."
            ],
            variant: "warning"
          }),
          Table({
            id: "two-fa-backup-codes-table",
            headers: [],
            rows: [],
            className: "border border-neon-cyan rounded-lg divide-none mt-8"
          }),
          Link({
            id: "two-fa-download-backup-codes-link",
            text: "Download",
            variant: "empty",
            href: "",
            className:
              "px-4 py-2 text-base inline-flex items-center justify-center rounded-md font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan uppercase border border-neon-cyan text-white hover:shadow-neon-cyan hover:bg-neon-cyan transition-all duration-500 ease-in-out"
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
      ?.addEventListener("click", () =>
        this.displayTwoFaPasswordModal("setup")
      );
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
      ?.addEventListener("click", () =>
        this.hideModal("two-fa-password-modal")
      );
    document
      .getElementById("two-fa-form")
      ?.addEventListener("submit", (event) => this.callTwoFaFormAction(event));

    if (this.hasTwoFa) {
      document
        .getElementById("generate-backup-codes")!
        .addEventListener("click", () =>
          this.displayTwoFaPasswordModal("backupCodes")
        );
      document
        .getElementById("donwload-backup-codes-link")
        ?.addEventListener("click", () => this.downloadBackupCodes());
      document
        .getElementById("two-fa-close-backup-codes-modal-button")
        ?.addEventListener("click", () => this.hideBackupCodesModal());
    }
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
        const isTwoFaCodeCorrect = await this.validateAndVerifyTwoFaCode();
        if (!isTwoFaCodeCorrect) return;

        this.hideTwoFaSetupModal();
        this.render();
        toaster.success("2FA setup successful");
      } else {
        this.hideTwoFaSetupModal();
        this.displayTwoFaPasswordModal("remove");
      }
    } catch (error) {
      router.handleError("Error in callTwoFaFormAction()", error);
    }
  }

  private callPasswordFormAction(event: Event): void {
    if (this.passwordFormAction === "setup") {
      this.displayTwoFaSetup(event);
    } else if (this.passwordFormAction === "remove") {
      this.removeTwoFa(event);
    } else if (this.passwordFormAction === "backupCodes") {
      this.generateAndDisplayBackupCodes(event);
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
      twoFaPasswordInputEl.value = "";
      const { qrcode } = apiResponse.data;

      const twoFaQrCodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
      twoFaQrCodeEl.src = qrcode;

      this.hideOverlay();
      this.displayModal("two-fa-modal");
    } catch (error) {
      router.handleError("Error in displayTwoFaSetup()", error);
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
      twoFaPasswordInputEl.value = "";
      this.hideModal("two-fa-password-modal");
      this.passwordFormAction = "setup";
      this.render();
      toaster.success("2FA removed successfully");
    } catch (error) {
      router.handleError("Error in removeTwoFa()", error);
    }
  }

  private async generateAndDisplayBackupCodes(event: Event) {
    try {
      event.preventDefault();
      const twoFaPasswordInputEl = getInputEl("two-fa-password-input");
      const twoFaPasswordInputErrorEl = getEl("two-fa-password-input-error");
      // // FIXME: activate when password policy is applied
      // // if (!validatePassword(twoFaPasswordInputEl, twoFaPasswordInputErrorEl))
      // //   return;

      const apiResponse = await generateBackupCodes(twoFaPasswordInputEl.value);
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
      this.fillBackupCodesTable(apiResponse.data.backupCodes);
      this.setupBackupCodesLink(apiResponse.data.backupCodes);
      this.displayModal("two-fa-backup-codes-modal");
    } catch (error) {
      router.handleError("Error in generateAndDisplayBackupCodes()", error);
    }
  }

  private fillBackupCodesTable(backupCodes: string[]) {
    const backupCodesTableEl = getEl(
      "two-fa-backup-codes-table"
    ) as HTMLTableElement;

    const tbody = backupCodesTableEl.tBodies[0];
    tbody.classList.add("divide-none");
    tbody.innerHTML = backupCodes
      .map((code, index, array) => {
        if (index % 2 === 0) {
          return `<tr class="divide-none">
				  <td class="p-2">${code}</td>
				  <td class="p-2">${array[index + 1]}
			  </tr>`;
        }
        return "";
      })
      .join("");
  }

  private setupBackupCodesLink(backupCodes: string[]) {
    const downloadBackupCodesLink = getEl(
      "two-fa-download-backup-codes-link"
    ) as HTMLAnchorElement;
    downloadBackupCodesLink.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(backupCodes.join("\n"));
    downloadBackupCodesLink.setAttribute("download", "backup-codes.txt");
  }

  private downloadBackupCodes() {
    const downloadBackupCodesLink = getEl(
      "donwload-backup-codes-link"
    ) as HTMLAnchorElement;
    downloadBackupCodesLink.click();
  }

  private async validateAndVerifyTwoFaCode(): Promise<boolean> {
    const twoFaQrCodeInput = getEl("two-fa-qr-code-input") as HTMLInputElement;
    const twoFaQrCodeErrorEl = getEl("two-fa-qr-code-input-error");

    const isTwoFaCodeValid = await validateTwoFaCode(
      twoFaQrCodeInput,
      twoFaQrCodeErrorEl
    );
    if (!isTwoFaCodeValid) {
      return false;
    }

    const apiResponse = await verifyTwoFaCode(twoFaQrCodeInput.value);
    if (!apiResponse.success) {
      if (apiResponse.status === 401) {
        markInvalid("Invalid code.", twoFaQrCodeInput, twoFaQrCodeErrorEl);
        return false;
      } else {
        throw new ApiError(apiResponse);
      }
    }
    return true;
  }

  private hideTwoFaSetupModal() {
    const twoFaModal = getEl("two-fa-modal");
    const twoFaQrCodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
    twoFaQrCodeEl.src = "";
    twoFaModal.classList.add("hidden");
    this.hideOverlay();
  }

  private displayOverlay(): void {
    const overlay = document.getElementById("overlay-root");
    overlay?.classList.remove("hidden");
  }

  private displayModal(modalId: string) {
    this.hideAllModals();
    this.displayOverlay();
    const modal = getEl(modalId);
    modal.classList.remove("hidden");
  }

  private displayTwoFaPasswordModal(
    action: "setup" | "remove" | "backupCodes"
  ) {
    this.hideAllModals();
    this.displayModal("two-fa-password-modal");
    this.passwordFormAction = action;
    this.displayOverlay();
  }

  private hideBackupCodesModal() {
    const backupCodesTableEl = getEl(
      "two-fa-backup-codes-table"
    ) as HTMLTableElement;
    backupCodesTableEl.tBodies[0].innerHTML = "";
    this.hideModal("two-fa-backup-codes-modal");
  }

  private hideOverlay(): void {
    const overlay = document.getElementById("overlay-root");
    overlay?.classList.add("hidden");
  }

  private hideModal(modalId: string) {
    this.hideOverlay();
    const modal = getEl(modalId);
    modal.classList.add("hidden");
  }
  private hideAllModals() {
    const allModals = document.querySelectorAll("[id$='-modal']");
    allModals.forEach((modal) => {
      this.hideModal(modal.id);
    });
  }

  private async fetchData(): Promise<void> {
    try {
      if (this.hasLocalAuth)
        this.hasTwoFa = getDataOrThrow(await geTwoFaStatus()).hasTwoFa;
    } catch (error) {
      router.handleError("Error in fetchData()", error);
    }
  }
}
