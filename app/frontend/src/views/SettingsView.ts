import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Modal } from "../components/Modal.js";
import { TextBox } from "../components/TextBox.js";
import { Input } from "../components/Input.js";
import { Image } from "../components/Image.js";
import {
  generateBackupCodes,
  generateTwoFAQRcode,
  geTwoFAStatus,
  removeTwoFA,
  verifyTwoFACodeAndGetBackupCodes
} from "../services/authServices.js";
import { markInvalid, validateTwoFACode } from "../validate.js";
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
  private hasTwoFA: boolean = false;
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  private passwordFormAction: "setup" | "remove" | "backupCodes" = "setup";

  private twoFASetupButtonEl!: HTMLButtonElement;
  private twoFAFormEl!: HTMLFormElement;
  private twoFACodeInputEl!: HTMLInputElement;
  private twoFACodeInputErrorEl!: HTMLElement;
  private twoFAPasswordFormEl!: HTMLFormElement;
  private twoFAPasswordInputEl!: HTMLInputElement;
  private twoFAPasswordInputErrorEl!: HTMLElement;
  private twoFACloseTwoFAModalButtonEl!: HTMLButtonElement;
  private twoFAClosePasswordModalButtonEl!: HTMLButtonElement;
  private twoFAGenerateBackupCodesButtonEl!: HTMLButtonElement;
  private twoFABackupCodesTableEl!: HTMLTableElement;
  private twoFADownloadBackupCodesLinkEl!: HTMLAnchorElement;
  private twoFABackupCodesCloseModalButtonEl!: HTMLElement;
  private twoFAQRCodeEl!: HTMLImageElement;

  private preferredLanguageFormEl!: HTMLFormElement;
  private preferredLanguageButtonEl!: HTMLElement;
  private preferredLanguageOptionsEl!: HTMLElement;
  private selectedLanguage: Language = i18next.language as Language;

  constructor() {
    super();
    this.setTitle(i18next.t("settingsView.title"));
  }

  private getTwoFASetupHTML(): string {
    return /* HTML */ `
      <div>
        ${Paragraph({
          id: "two-fa-intro",
          text: i18next.t("settingsView.editTwoFASetup")
        })}
        ${Button({
          id: "setup-two-fa-button",
          text: i18next.t("settingsView.twoFASetup"),
          variant: "default",
          size: "md",
          type: "button"
        })}
      </div>
      ${Modal({
        id: "two-fa-modal",
        idCloseButton: "close-two-fa-modal-button",
        children: [
          Form({
            children: [
              !this.hasTwoFA
                ? TextBox({
                    id: "two-fa-qr-code-info",
                    text: [
                      i18next.t("settingsView.twoFAInfo.0"),
                      i18next.t("settingsView.twoFAInfo.1"),
                      i18next.t("settingsView.twoFAInfo.2"),
                      i18next.t("settingsView.twoFAInfo.3")
                    ],
                    variant: "info",
                    size: "sm"
                  })
                : TextBox({
                    id: "two-fa-qr-code-info",
                    text: [i18next.t("settingsView.twoFAActivated.0")],
                    variant: "info",
                    size: "sm"
                  }),
              Image({
                id: "two-fa-qr-code",
                src: "",
                alt: "QR Code"
              }),
              !this.hasTwoFA
                ? Input({
                    id: "two-fa-code-input",
                    label: i18next.t("settingsView.enterTwoFACode"),
                    name: "two-fa-code-input",
                    type: "text",
                    placeholder: i18next.t("global.twoFACode"),
                    errorId: "two-fa-code-input-error",
                    className: "text-left"
                  })
                : Button({
                    id: "two-fa-generate-backup-codes",
                    text: i18next.t("settingsView.twoFAGenerateBackupCodes"),
                    type: "button"
                  }),
              !this.hasTwoFA
                ? Button({
                    id: "two-fa-submit",
                    text: i18next.t("settingsView.activateTwoFA"),
                    variant: "default",
                    size: "md",
                    type: "submit"
                  })
                : Button({
                    id: "two-fa-remove",
                    text: i18next.t("settingsView.deactivateTwoFA"),
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
                label: i18next.t("global.password"),
                name: "two-fa-password-input",
                placeholder: i18next.t("global.password"),
                type: "password",
                errorId: "two-fa-password-input-error",
                hasToggle: true
              }),
              Button({
                id: "two-fa-submit-password",
                text: i18next.t("settingsView.confirmPassword"),
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
              i18next.t("settingsView.twoFABackupCodeInfo.0"),
              i18next.t("settingsView.twoFABackupCodeInfo.1"),
              i18next.t("settingsView.twoFABackupCodeInfo.2"),
              i18next.t("settingsView.twoFABackupCodeInfo.3")
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
            text: i18next.t("settingsView.twoFADownloadBackupCodes"),
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
        <div class="flex flex-col mt-10">
          ${this.hasLocalAuth ? this.getTwoFASetupHTML() : ""}
          ${Form({
            id: "preferred-language-form",
            className: "mt-10",
            children: [
              Paragraph({
                text: i18next.t("settingsView.preferredLanguage")
              }),
              LanguageSwitcher({
                id: "preferred-language",
                selectedLang: i18next.language as Language,
                className: "w-64",
                size: "lg"
              }),
              Button({
                text: i18next.t("settingsView.saveLanguage"),
                variant: "default",
                size: "md",
                type: "submit",
                className: "mt-2 self-start"
              })
            ]
          })}
        </div>
      </div>
    `;
  }

  protected addListeners(): void {
    if (this.hasLocalAuth) {
      this.twoFASetupButtonEl.addEventListener("click", () =>
        this.displayTwoFAPasswordModal("setup")
      );
      this.twoFAFormEl.addEventListener("submit", (event) =>
        this.callTwoFAFormAction(event)
      );
      this.twoFAPasswordFormEl.addEventListener("submit", (event) =>
        this.callPasswordFormAction(event)
      );
      this.twoFACloseTwoFAModalButtonEl.addEventListener("click", () =>
        this.hideTwoFASetupModal()
      );
      this.twoFAClosePasswordModalButtonEl.addEventListener("click", () =>
        this.hideModal("two-fa-password-modal")
      );
      if (this.hasTwoFA) {
        this.twoFAGenerateBackupCodesButtonEl.addEventListener("click", () =>
          this.displayTwoFAPasswordModal("backupCodes")
        );
      }
      this.twoFABackupCodesCloseModalButtonEl.addEventListener("click", () =>
        this.hideBackupCodesModal()
      );
    }

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
    this.twoFASetupButtonEl = getButtonEl("setup-two-fa-button");
    this.twoFAFormEl = getEl("two-fa-form") as HTMLFormElement;
    this.twoFACodeInputEl = getInputEl("two-fa-code-input");
    this.twoFACodeInputErrorEl = getEl("two-fa-code-input-error");
    this.twoFAPasswordFormEl = getEl("two-fa-password-form") as HTMLFormElement;
    this.twoFAPasswordInputEl = getInputEl("two-fa-password-input");
    this.twoFAPasswordInputErrorEl = getEl("two-fa-password-input-error");
    this.twoFACloseTwoFAModalButtonEl = getButtonEl(
      "close-two-fa-modal-button"
    );
    this.twoFAClosePasswordModalButtonEl = getButtonEl(
      "close-two-fa-password-modal-button"
    );
    this.twoFAGenerateBackupCodesButtonEl = getButtonEl(
      "two-fa-generate-backup-codes"
    );
    this.twoFABackupCodesTableEl = getEl(
      "two-fa-backup-codes-table"
    ) as HTMLTableElement;
    this.twoFADownloadBackupCodesLinkEl = getEl(
      "two-fa-download-backup-codes-link"
    ) as HTMLAnchorElement;
    this.twoFABackupCodesCloseModalButtonEl = getButtonEl(
      "two-fa-close-backup-codes-modal-button"
    );
    this.twoFAQRCodeEl = getEl("two-fa-qr-code") as HTMLImageElement;
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

  private async callTwoFAFormAction(event: Event): Promise<void> {
    try {
      event.preventDefault();
      if (!this.hasTwoFA) {
        const isTwoFACodeValid = await validateTwoFACode(
          this.twoFACodeInputEl,
          this.twoFACodeInputErrorEl
        );
        if (!isTwoFACodeValid) {
          return;
        }

        const apiResponse = await verifyTwoFACodeAndGetBackupCodes(
          this.twoFACodeInputEl.value
        );
        if (!apiResponse.success) {
          if (apiResponse.status === 401) {
            markInvalid(
              i18next.t("invalid.twoFACode"),
              this.twoFACodeInputEl,
              this.twoFACodeInputErrorEl
            );
            return;
          } else {
            throw new ApiError(apiResponse);
          }
        }

        toaster.success(i18next.t("toast.twoFASetupSuccess"));
        this.fillBackupCodesTable(apiResponse.data.backupCodes);
        this.setupBackupCodesLink(apiResponse.data.backupCodes);
        this.displayModal("two-fa-backup-codes-modal");
      } else {
        this.hideTwoFASetupModal();
        this.displayTwoFAPasswordModal("remove");
      }
    } catch (error) {
      router.handleError("Error in callTwoFAFormAction()", error);
    }
  }

  private callPasswordFormAction(event: Event): void {
    if (this.passwordFormAction === "setup") {
      this.render();
      this.displayTwoFASetup(event);
    } else if (this.passwordFormAction === "remove") {
      this.removeTwoFA(event);
    } else if (this.passwordFormAction === "backupCodes") {
      this.generateAndDisplayBackupCodes(event);
    }
  }

  private async displayTwoFASetup(event: Event) {
    try {
      event.preventDefault();

      // FIXME: activate when password policy is applied
      // if (!validatePassword(this.twoFAPasswordInputEl, this.twoFAPasswordInputErrorEl))
      //   return;

      const apiResponse = await generateTwoFAQRcode(
        this.twoFAPasswordInputEl.value
      );
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          markInvalid(
            "Invalid password.",
            this.twoFAPasswordInputEl,
            this.twoFAPasswordInputErrorEl
          );
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      this.twoFAPasswordInputEl.value = "";
      const { qrcode } = apiResponse.data;

      this.twoFAQRCodeEl.src = qrcode;

      this.hideOverlay();
      this.displayModal("two-fa-modal");
    } catch (error) {
      router.handleError("Error in displayTwoFASetup()", error);
    }
  }

  private async removeTwoFA(event: Event): Promise<void> {
    try {
      event.preventDefault();

      // FIXME: activate when password policy is applied
      // if (!validatePassword(twoFAPasswordInputEl, twoFAPasswordInputErrorEl))
      //   return;
      const apiResponse = await removeTwoFA(this.twoFAPasswordInputEl.value);
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          markInvalid(
            "Invalid password.",
            this.twoFAPasswordInputEl,
            this.twoFAPasswordInputErrorEl
          );
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      this.twoFAPasswordInputEl.value = "";
      this.hideModal("two-fa-password-modal");
      this.passwordFormAction = "setup";
      toaster.success(i18next.t("toast.twoFARemoveSuccess"));
    } catch (error) {
      router.handleError("Error in removeTwoFA()", error);
    }
  }

  private async generateAndDisplayBackupCodes(event: Event) {
    try {
      event.preventDefault();
      // // FIXME: activate when password policy is applied
      // // if (!validatePassword(this.twoFAPasswordInputEl, this.twoFAPasswordInputErrorEl))
      // //   return;

      const apiResponse = await generateBackupCodes(
        this.twoFAPasswordInputEl.value
      );
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          markInvalid(
            "Invalid password.",
            this.twoFAPasswordInputEl,
            this.twoFAPasswordInputErrorEl
          );
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      this.twoFAPasswordInputEl.value = "";
      this.fillBackupCodesTable(apiResponse.data.backupCodes);
      this.setupBackupCodesLink(apiResponse.data.backupCodes);
      this.displayModal("two-fa-backup-codes-modal");
    } catch (error) {
      router.handleError("Error in generateAndDisplayBackupCodes()", error);
    }
  }

  private fillBackupCodesTable(backupCodes: string[]) {
    const tbody = this.twoFABackupCodesTableEl.tBodies[0];
    tbody.classList.add("divide-none");
    for (let i = 0; i < backupCodes.length; i += 2) {
      const tr = document.createElement("tr");
      tr.classList.add("divide-none");

      const td1 = document.createElement("td");
      td1.classList.add("p-2");
      td1.textContent = backupCodes[i];

      const td2 = document.createElement("td");
      td2.classList.add("p-2");
      td2.textContent = backupCodes[i + 1];

      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    }
  }

  private setupBackupCodesLink(backupCodes: string[]) {
    this.twoFADownloadBackupCodesLinkEl.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(backupCodes.join("\n"));
    this.twoFADownloadBackupCodesLinkEl.setAttribute(
      "download",
      "backup-codes.txt"
    );
  }

  private hideTwoFASetupModal() {
    this.twoFAQRCodeEl.src = "";
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

  private displayTwoFAPasswordModal(
    action: "setup" | "remove" | "backupCodes"
  ) {
    this.hideAllModals();
    this.displayModal("two-fa-password-modal");
    this.passwordFormAction = action;
    this.displayOverlay();
  }

  private hideBackupCodesModal() {
    this.twoFABackupCodesTableEl.tBodies[0].innerHTML = "";
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
        this.hasTwoFA = getDataOrThrow(await geTwoFAStatus()).hasTwoFA;
    } catch (error) {
      router.handleError("Error in fetchData()", error);
    }
  }
}
