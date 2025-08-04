import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Modal } from "../components/Modal.js";
import { TextBox } from "../components/TextBox.js";
import { Input } from "../components/Input.js";
import { Image } from "../components/Image.js";
import {
  generateBackupCodes,
  generateTwoFaQrcode as generateTwoFaQrcode,
  geTwoFaStatus,
  removeTwoFa,
  verifyTwoFaCodeAndGetBackupCodes
} from "../services/authServices.js";
import {
  markInvalid,
  validatTwoFaCode as validateTwoFaCode
} from "../validate.js";
import { ApiError, getDataOrThrow } from "../services/api.js";
import { router } from "../routing/Router.js";
import { Link } from "../components/Link.js";
import { Table } from "../components/Table.js";
import { Form } from "../components/Form.js";
import { Button } from "../components/Button.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { patchUser } from "../services/userServices.js";
import { toaster } from "../Toaster.js";
import { auth } from "../AuthManager.js";
import { User, Language } from "../types/User.js";
import { getButtonEl, getEl, getInputEl } from "../utility.js";

export default class SettingsView extends AbstractView {
  private hasTwoFa: boolean = false;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  private passwordFormAction: "setup" | "remove" | "backupCodes" = "setup";

  private twoFaSetupButtonEl!: HTMLButtonElement;
  private twoFaFormEl!: HTMLFormElement;
  private twoFaCodeInputEl!: HTMLInputElement;
  private twoFaCodeInputErrorEl!: HTMLElement;
  private twoFaPasswordFormEl!: HTMLFormElement;
  private twoFaPasswordInputEl!: HTMLInputElement;
  private twoFaPasswordInputErrorEl!: HTMLElement;
  private twoFaCloseTwoFaModalButtonEl!: HTMLButtonElement;
  private twoFaClosePasswordModalButtonEl!: HTMLButtonElement;
  private twoFaGenerateBackupCodesButtonEl!: HTMLButtonElement;
  private twoFaBackupCodesTableEl!: HTMLTableElement;
  private twoFaDownloadBackupCodesLinkEl!: HTMLAnchorElement;
  private twoFaBackupCodesCloseModalButtonEl!: HTMLElement;
  private twoFaQrCodeEl!: HTMLImageElement;

  private preferredLanguageFormEl!: HTMLFormElement;
  private preferredLanguageButtonEl!: HTMLElement;
  private preferredLanguageOptionsEl!: HTMLElement;
  private selectedLanguage: Language = i18next.language as Language;

  constructor() {
    super();
    this.setTitle(i18next.t("settingsView.title"));
  }

  private get2FaSetupHTML(): string {
    return /* HTML */ `
      ${Button({
        id: "setup-two-fa-button",
        text: "2FA Setup",
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
                    id: "two-fa-code-input",
                    label: "Enter code",
                    name: "two-fa-code-input",
                    type: "text",
                    placeholder: "Code",
                    errorId: "two-fa-code-input-error",
                    className: "text-left"
                  })
                : Button({
                    id: "two-fa-generate-backup-codes",
                    text: "Generate Backup Codes",
                    type: "button"
                  }),
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
          text: i18next.t("settingsView.title"),
          variant: "default"
        })}
        ${Paragraph({
          text: i18next.t("settingsView.settings"),
          id: "settings-intro"
        })}
        <div class="mt-24 text-center inline-block">
          ${this.hasLocalAuth ? this.get2FaSetupHTML() : ""}
          ${Form({
            id: "preferred-language-form",
            className: "flex flex-col gap-4",
            children: [
              Paragraph({
                text: i18next.t("settingsView.preferredLanguage")
              }),
              `<div class="flex flex-wrap items-end gap-4 mt-2">
			  ${LanguageSwitcher({
          id: "preferred-language",
          selectedLang: i18next.language as Language,
          className: "w-64",
          size: "lg"
        })}
			  ${Button({
          text: i18next.t("settingsView.saveLanguage"),
          variant: "default",
          size: "md",
          type: "submit",
          className: "mt-2 self-start"
        })}
			</div>`
            ]
          })}
        </div>
      </div>
    `;
  }

  // ${this.hasLocalAuth ? this.get2FaSetupHTML() : ""}

  protected addListeners(): void {
    this.twoFaSetupButtonEl.addEventListener("click", () =>
      this.displayTwoFaPasswordModal("setup")
    );
    this.twoFaPasswordFormEl.addEventListener("submit", (event) =>
      this.callPasswordFormAction(event)
    );
    this.twoFaCloseTwoFaModalButtonEl.addEventListener("click", () =>
      this.hideTwoFaSetupModal()
    );
    this.twoFaClosePasswordModalButtonEl.addEventListener("click", () =>
      this.hideModal("two-fa-password-modal")
    );
    this.twoFaFormEl.addEventListener("submit", (event) =>
      this.callTwoFaFormAction(event)
    );

    if (this.hasTwoFa) {
      this.twoFaGenerateBackupCodesButtonEl.addEventListener("click", () =>
        this.displayTwoFaPasswordModal("backupCodes")
      );
    }
    this.twoFaDownloadBackupCodesLinkEl.addEventListener("click", () =>
      this.downloadBackupCodes()
    );
    this.twoFaBackupCodesCloseModalButtonEl.addEventListener("click", () =>
      this.hideBackupCodesModal()
    );

    this.preferredLanguageFormEl.addEventListener("submit", (event) =>
      this.updatePreferredLanguage(event)
    );

    this.preferredLanguageButtonEl.addEventListener("click", () => {
      this.preferredLanguageOptionsEl.classList.toggle("hidden");
    });

    this.preferredLanguageOptionsEl
      .querySelectorAll("button[data-lang]")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const lang = (e.currentTarget as HTMLElement).dataset
            .lang as Language;
          auth.updateLanguage(lang);
        });
      });

    document.addEventListener("click", this.onDocumentClick);
  }

  async render() {
    await this.fetchData();
    this.updateHTML();
    this.preferredLanguageFormEl = document.querySelector<HTMLFormElement>(
      "#preferred-language-form"
    )!;
    this.preferredLanguageButtonEl = getButtonEl("preferred-language-button")!;
    this.preferredLanguageOptionsEl = getEl("preferred-language-options")!;
    this.twoFaSetupButtonEl = getButtonEl("setup-two-fa-button");
    this.twoFaFormEl = getEl("two-fa-form") as HTMLFormElement;
    this.twoFaCodeInputEl = getInputEl("two-fa-code-input");
    this.twoFaCodeInputErrorEl = getEl("two-fa-code-input-error");
    this.twoFaPasswordFormEl = getEl("two-fa-password-form") as HTMLFormElement;
    this.twoFaPasswordInputEl = getInputEl("two-fa-password-input");
    this.twoFaPasswordInputErrorEl = getEl("two-fa-password-input-error");
    this.twoFaCloseTwoFaModalButtonEl = getButtonEl(
      "close-two-fa-modal-button"
    );
    this.twoFaClosePasswordModalButtonEl = getButtonEl(
      "close-two-fa-password-modal-button"
    );
    this.twoFaGenerateBackupCodesButtonEl = getButtonEl(
      "two-fa-generate-backup-codes"
    );
    console.log("button el:", this.twoFaGenerateBackupCodesButtonEl);
    this.twoFaBackupCodesTableEl = getEl(
      "two-fa-backup-codes-table"
    ) as HTMLTableElement;
    this.twoFaDownloadBackupCodesLinkEl = getEl(
      "two-fa-download-backup-codes-link"
    ) as HTMLAnchorElement;
    this.twoFaBackupCodesCloseModalButtonEl = getButtonEl(
      "two-fa-close-backup-codes-modal-button"
    );
    this.twoFaQrCodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
    this.addListeners();
  }

  private onDocumentClick = (event: MouseEvent) => {
    if (
      !this.preferredLanguageButtonEl.contains(event.target as Node) &&
      !this.preferredLanguageOptionsEl.contains(event.target as Node)
    ) {
      this.preferredLanguageOptionsEl.classList.add("hidden");
    }
  };

  unmount(): void {
    document.removeEventListener("click", this.onDocumentClick);
  }

  private async updatePreferredLanguage(event: Event): Promise<void> {
    event.preventDefault();

    const updatedUser: Partial<User> = {
      ...(this.selectedLanguage ? { language: this.selectedLanguage } : {})
    };

    try {
      getDataOrThrow(await patchUser(updatedUser));
      toaster.success(i18next.t("toast.profileUpdatedSuccess"));
      auth.updateUser(updatedUser);
    } catch (err) {
      console.error("Failed to update preferred language:", err);
      toaster.error(i18next.t("toast.profileUpdateFailed"));
    }
  }

  getName(): string {
    return "settings";
  }

  private async callTwoFaFormAction(event: Event): Promise<void> {
    try {
      event.preventDefault();
      if (!this.hasTwoFa) {
        const isTwoFaCodeValid = await validateTwoFaCode(
          this.twoFaCodeInputEl,
          this.twoFaCodeInputErrorEl
        );
        if (!isTwoFaCodeValid) {
          return;
        }

        const apiResponse = await verifyTwoFaCodeAndGetBackupCodes(
          this.twoFaCodeInputEl.value
        );
        if (!apiResponse.success) {
          if (apiResponse.status === 401) {
            markInvalid(
              "Invalid code.",
              this.twoFaCodeInputEl,
              this.twoFaCodeInputErrorEl
            );
            return;
          } else {
            throw new ApiError(apiResponse);
          }
        }

        toaster.success("2FA setup successful");
        this.fillBackupCodesTable(apiResponse.data.backupCodes);
        this.setupBackupCodesLink(apiResponse.data.backupCodes);
        this.displayModal("two-fa-backup-codes-modal");
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

      // FIXME: activate when password policy is applied
      // if (!validatePassword(this.twoFaPasswordInputEl, this.twoFaPasswordInputErrorEl))
      //   return;

      const apiResponse = await generateTwoFaQrcode(
        this.twoFaPasswordInputEl.value
      );
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          markInvalid(
            "Invalid password.",
            this.twoFaPasswordInputEl,
            this.twoFaPasswordInputErrorEl
          );
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      this.twoFaPasswordInputEl.value = "";
      const { qrcode } = apiResponse.data;

      this.twoFaQrCodeEl.src = qrcode;

      this.hideOverlay();
      this.displayModal("two-fa-modal");
    } catch (error) {
      router.handleError("Error in displayTwoFaSetup()", error);
    }
  }

  private async removeTwoFa(event: Event): Promise<void> {
    try {
      event.preventDefault();

      // FIXME: activate when password policy is applied
      // if (!validatePassword(twoFaPasswordInputEl, twoFaPasswordInputErrorEl))
      //   return;
      const apiResponse = await removeTwoFa(this.twoFaPasswordInputEl.value);
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          markInvalid(
            "Invalid password.",
            this.twoFaPasswordInputEl,
            this.twoFaPasswordInputErrorEl
          );
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      this.twoFaPasswordInputEl.value = "";
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
      // // FIXME: activate when password policy is applied
      // // if (!validatePassword(this.twoFaPasswordInputEl, this.twoFaPasswordInputErrorEl))
      // //   return;

      const apiResponse = await generateBackupCodes(
        this.twoFaPasswordInputEl.value
      );
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          markInvalid(
            "Invalid password.",
            this.twoFaPasswordInputEl,
            this.twoFaPasswordInputErrorEl
          );
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      this.twoFaPasswordInputEl.value = "";
      this.fillBackupCodesTable(apiResponse.data.backupCodes);
      this.setupBackupCodesLink(apiResponse.data.backupCodes);
      this.displayModal("two-fa-backup-codes-modal");
    } catch (error) {
      router.handleError("Error in generateAndDisplayBackupCodes()", error);
    }
  }

  private fillBackupCodesTable(backupCodes: string[]) {
    const tbody = this.twoFaBackupCodesTableEl.tBodies[0];
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
    this.twoFaDownloadBackupCodesLinkEl.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(backupCodes.join("\n"));
    this.twoFaDownloadBackupCodesLinkEl.setAttribute(
      "download",
      "backup-codes.txt"
    );
  }

  private downloadBackupCodes() {
    this.twoFaDownloadBackupCodesLinkEl.click();
  }

  private hideTwoFaSetupModal() {
    this.twoFaQrCodeEl.src = "";
    this.hideModal("two-fa-modal");
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
    this.twoFaBackupCodesTableEl.tBodies[0].innerHTML = "";
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
