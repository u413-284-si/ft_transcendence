import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Modal, addCloseModalListener } from "../components/Modal.js";
import { TextBox } from "../components/TextBox.js";
import { Input, addTogglePasswordListener } from "../components/Input.js";
import { Image } from "../components/Image.js";
import {
  generateBackupCodes,
  generateTwoFAQRcode,
  removeTwoFA,
  verifyTwoFACodeAndGetBackupCodes
} from "../services/authServices.js";
import {
  clearInvalid,
  markInvalid,
  validatePassword,
  validateTwoFACode
} from "../validate.js";
import { ApiError, getDataOrThrow } from "../services/api.js";
import { Link } from "../components/Link.js";
import { Table } from "../components/Table.js";
import { Form } from "../components/Form.js";
import { Button } from "../components/Button.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { deleteUser, patchUser } from "../services/userServices.js";
import { toaster } from "../Toaster.js";
import { auth } from "../AuthManager.js";
import { User, Language } from "../types/User.js";
import {
  disableButton,
  getAllBySelector,
  getById,
  getBySelector
} from "../utility.js";
import { Header2 } from "../components/Header2.js";
import { viewLogger } from "../logging/config.js";

export default class SettingsView extends AbstractView {
  private hasLocalAuth: boolean = auth.getUser().authProvider === "LOCAL";

  private passwordFormAction: "setup" | "remove" | "backupCodes" = "setup";

  private twoFASetupButtonEl!: HTMLButtonElement;
  private twoFAModalEl!: HTMLDialogElement;
  private twoFAFormEl!: HTMLFormElement;
  private twoFASubmitButton!: HTMLButtonElement;
  private twoFACodeInputEl!: HTMLInputElement;
  private twoFACodeInputErrorEl!: HTMLElement;
  private twoFAPasswordModalEl!: HTMLDialogElement;
  private twoFAPasswordFormEl!: HTMLFormElement;
  private twoFAPasswortSubmitButton!: HTMLButtonElement;
  private twoFAPasswordInputEl!: HTMLInputElement;
  private twoFAPasswordInputErrorEl!: HTMLElement;
  private twoFAGenerateBackupCodesButtonEl!: HTMLButtonElement;
  private twoFABackupCodesModalEl!: HTMLDialogElement;
  private twoFABackupCodesTableEl!: HTMLTableElement;
  private twoFADownloadBackupCodesLinkEl!: HTMLAnchorElement;
  private twoFAQRCodeEl!: HTMLImageElement;

  private preferredLanguageFormEl!: HTMLFormElement;
  private preferredLanguageButtonEl!: HTMLElement;
  private preferredLanguageOptionsEl!: HTMLElement;

  private deleteProfileButtonEl!: HTMLButtonElement;

  constructor() {
    super();
    this.setTitle();
  }

  private hasTwoFA(): boolean {
    return auth.getUser().hasTwoFA;
  }

  private getTwoFASetupHTML(): string {
    return /* HTML */ `
      <div>
        ${Paragraph({
          id: "two-fa-intro",
          text: i18next.t("settingsView.editTwoFASetup")
        })}
        ${!this.hasTwoFA()
          ? Button({
              id: "setup-two-fa-button",
              text: i18next.t("settingsView.twoFASetup"),
              variant: "default",
              size: "md",
              type: "button"
            })
          : Button({
              id: "setup-two-fa-button",
              text: i18next.t("settingsView.twoFASetup"),
              variant: "active",
              size: "md",
              type: "button"
            })}
      </div>
      ${Modal({
        id: "two-fa-modal",
        children: [
          Form({
            children: [
              !this.hasTwoFA()
                ? TextBox({
                    id: "two-fa-qr-code-info",
                    text: i18next.t("settingsView.twoFAInfo", {
                      returnObjects: true
                    }),
                    variant: "info",
                    size: "sm"
                  })
                : TextBox({
                    id: "two-fa-qr-code-info",
                    text: i18next.t("settingsView.twoFAActivated", {
                      returnObjects: true
                    }),
                    variant: "info",
                    size: "sm"
                  }),
              Image({
                id: "two-fa-qr-code",
                src: "",
                alt: "QR Code"
              }),
              !this.hasTwoFA()
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
              !this.hasTwoFA()
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
        children: [
          Form({
            id: "two-fa-password-form",
            children: [
              Input({
                id: "two-fa-password-input",
                label: i18next.t("settingsView.displayTwoFASetup"),
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
        children: [
          TextBox({
            id: "two-fa-backup-codes-info",
            text: i18next.t("settingsView.twoFABackupCodeInfo", {
              returnObjects: true
            }),
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
            variant: "download",
            filename: "backup-codes.txt"
          })
        ]
      })}
    `;
  }

  createHTML() {
    return /* HTML */ `
      ${Header1({
        text: i18next.t("settingsView.title"),
        variant: "default"
      })}
      ${Paragraph({
        text: i18next.t("settingsView.settings"),
        id: "settings-intro"
      })}
      <div class="flex flex-col mt-10 text-center">
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
        ${Header2({
          text: i18next.t("settingsView.dangerZone"),
          variant: "error",
          className: "mt-8 mb-4"
        })}
        ${Button({
          text: i18next.t("settingsView.deleteProfile"),
          id: "delete-profile",
          variant: "danger",
          size: "md",
          type: "button"
        })}
      </div>
    `;
  }

  protected override addListeners(): void {
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
      addTogglePasswordListener(this.twoFAPasswordInputEl.id);
      addCloseModalListener(this.twoFAModalEl.id);
      this.twoFAModalEl.addEventListener("close", () =>
        this.clearTwoFASetupData()
      );
      this.twoFAModalEl.addEventListener("cancel", () =>
        this.clearTwoFASetupData()
      );
      addCloseModalListener(this.twoFAPasswordModalEl.id);
      this.twoFAPasswordModalEl.addEventListener("close", () =>
        this.clearPassword()
      );
      this.twoFAPasswordModalEl.addEventListener("cancel", () =>
        this.clearPassword()
      );
      if (this.hasTwoFA()) {
        this.twoFAGenerateBackupCodesButtonEl.addEventListener("click", () =>
          this.displayTwoFAPasswordModal("backupCodes")
        );
        addCloseModalListener(this.twoFABackupCodesModalEl.id);
        this.twoFABackupCodesModalEl.addEventListener("close", () =>
          this.clearBackupCodesTable()
        );
        this.twoFABackupCodesModalEl.addEventListener("cancel", () =>
          this.clearBackupCodesTable()
        );
      }
    }

    this.preferredLanguageFormEl.addEventListener("submit", (event) =>
      this.updatePreferredLanguage(event)
    );

    this.preferredLanguageButtonEl.addEventListener("click", () => {
      this.preferredLanguageOptionsEl.classList.toggle("hidden");
    });

    const buttons = getAllBySelector<HTMLButtonElement>("button[data-lang]", {
      root: this.preferredLanguageOptionsEl
    });
    buttons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const lang = (e.currentTarget as HTMLElement).dataset.lang as Language;
        await auth.updateLanguage(lang);
      });
    });

    this.deleteProfileButtonEl.addEventListener("click", () => {
      this.deleteProfile();
    });

    document.addEventListener("click", this.onDocumentClick);
  }

  private initTwoFAElements(): void {
    this.twoFASetupButtonEl = getById("setup-two-fa-button");
    this.twoFAModalEl = getById("two-fa-modal");
    this.twoFAFormEl = getById("two-fa-form");
    this.twoFAPasswordModalEl = getById("two-fa-password-modal");
    this.twoFAPasswordFormEl = getById("two-fa-password-form");
    this.twoFAPasswortSubmitButton = getById("two-fa-submit-password");
    this.twoFAPasswordInputEl = getById("two-fa-password-input");
    this.twoFAPasswordInputErrorEl = getById("two-fa-password-input-error");
    this.twoFAQRCodeEl = getById("two-fa-qr-code");

    this.twoFABackupCodesModalEl = getById("two-fa-backup-codes-modal");
    this.twoFABackupCodesTableEl = getById("two-fa-backup-codes-table");
    this.twoFADownloadBackupCodesLinkEl = getById(
      "two-fa-download-backup-codes-link"
    );
    if (!this.hasTwoFA()) {
      this.twoFASubmitButton = getById("two-fa-submit");
      this.twoFACodeInputEl = getById("two-fa-code-input");
      this.twoFACodeInputErrorEl = getById("two-fa-code-input-error");
    } else {
      this.twoFAGenerateBackupCodesButtonEl = getById(
        "two-fa-generate-backup-codes"
      );
    }
  }

  protected override cacheNodes(): void {
    this.preferredLanguageFormEl = getById("preferred-language-form");
    this.preferredLanguageButtonEl = getById("preferred-language-button");
    this.preferredLanguageOptionsEl = getById("preferred-language-options");
    if (this.hasLocalAuth) this.initTwoFAElements();
    this.deleteProfileButtonEl = getById("delete-profile");
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

    const selectedLanguage = i18next.language as Language;

    const updatedUser: Partial<User> = {
      ...(selectedLanguage ? { language: selectedLanguage } : {})
    };

    try {
      getDataOrThrow(await patchUser(updatedUser));
      toaster.success(i18next.t("toast.profileUpdatedSuccess"));
    } catch (err) {
      viewLogger.error("Failed to update preferred language:", err);
      toaster.error(i18next.t("toast.profileUpdateFailed"));
    }
  }

  getName(): string {
    return i18next.t("settingsView.title");
  }

  private async callTwoFAFormAction(event: Event): Promise<void> {
    try {
      event.preventDefault();
      if (!this.hasTwoFA()) {
        disableButton(this.twoFASubmitButton);
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

        const backupCodes = apiResponse.data.backupCodes;

        toaster.success(i18next.t("toast.twoFASetupSuccess"));
        this.fillBackupCodesTable(backupCodes);
        this.setupBackupCodesLink(backupCodes);
        this.twoFAModalEl.close();
        this.twoFABackupCodesModalEl.showModal();
      } else {
        this.twoFAModalEl.close();
        this.displayTwoFAPasswordModal("remove");
      }
    } catch (error) {
      toaster.error(i18next.t("toast.somethingWentWrong"));
      viewLogger.error("Error in callTwoFAFormAction():", error);
    }
  }

  private callPasswordFormAction(event: Event): void {
    if (this.passwordFormAction === "setup") {
      this.displayTwoFASetup(event);
    } else if (this.passwordFormAction === "remove") {
      this.removeTwoFA(event);
    } else if (this.passwordFormAction === "backupCodes") {
      this.generateAndDisplayBackupCodes(event);
    }
  }

  private async displayTwoFASetup(event: Event): Promise<void> {
    try {
      event.preventDefault();
      disableButton(this.twoFAPasswortSubmitButton);
      if (
        !validatePassword(
          this.twoFAPasswordInputEl,
          this.twoFAPasswordInputErrorEl
        )
      )
        return;

      const apiResponse = await generateTwoFAQRcode(
        this.twoFAPasswordInputEl.value
      );
      this.twoFAPasswordInputEl.value = "";
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
      const { qrcode } = apiResponse.data;

      this.twoFAQRCodeEl.src = qrcode;

      this.twoFAPasswordModalEl.close();
      this.twoFAModalEl.showModal();
      if (!this.hasTwoFA()) this.twoFACodeInputEl.focus();
    } catch (error) {
      toaster.error(i18next.t("toast.somethingWentWrong"));
      viewLogger.error("Error in displayTwoFASetup():", error);
    }
  }

  private async removeTwoFA(event: Event): Promise<void> {
    try {
      event.preventDefault();
      disableButton(this.twoFAPasswortSubmitButton);
      if (
        !validatePassword(
          this.twoFAPasswordInputEl,
          this.twoFAPasswordInputErrorEl
        )
      )
        return;
      const apiResponse = await removeTwoFA(this.twoFAPasswordInputEl.value);
      this.twoFAPasswordInputEl.value = "";
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

      toaster.success(i18next.t("toast.twoFARemoveSuccess"));
    } catch (error) {
      toaster.error(i18next.t("toast.somethingWentWrong"));
      viewLogger.error("Error in removeTwoFA():", error);
    }
  }

  private async generateAndDisplayBackupCodes(event: Event): Promise<void> {
    try {
      event.preventDefault();
      disableButton(this.twoFAPasswortSubmitButton);
      if (
        !validatePassword(
          this.twoFAPasswordInputEl,
          this.twoFAPasswordInputErrorEl
        )
      )
        return;

      const apiResponse = await generateBackupCodes(
        this.twoFAPasswordInputEl.value
      );
      this.twoFAPasswordInputEl.value = "";
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
      this.fillBackupCodesTable(apiResponse.data.backupCodes);
      this.setupBackupCodesLink(apiResponse.data.backupCodes);
      this.twoFAPasswordModalEl.close();
      this.twoFABackupCodesModalEl.showModal();
    } catch (error) {
      toaster.error(i18next.t("toast.somethingWentWrong"));
      viewLogger.error("Error in generateAndDisplayBackupCodes():", error);
    }
  }

  private fillBackupCodesTable(backupCodes: string[]): void {
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

  private setupBackupCodesLink(backupCodes: string[]): void {
    this.twoFADownloadBackupCodesLinkEl.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(backupCodes.join("\n"));
  }

  private clearQRCode(): void {
    this.twoFAQRCodeEl.src = "";
  }

  private clearBackupCodesTable(): void {
    this.twoFABackupCodesTableEl.tBodies[0].innerHTML = "";
  }

  private clearPassword(): void {
    this.twoFAPasswordInputEl.value = "";
    clearInvalid(this.twoFAPasswordInputEl, this.twoFAPasswordInputErrorEl);
  }

  private clearTwoFACode(): void {
    if (!this.hasTwoFA()) {
      this.twoFACodeInputEl.value = "";
      clearInvalid(this.twoFACodeInputEl, this.twoFACodeInputErrorEl);
    }
  }

  private clearTwoFASetupData(): void {
    this.clearQRCode();
    this.clearTwoFACode();
  }

  private async displayTwoFAPasswordModal(
    action: "setup" | "remove" | "backupCodes"
  ): Promise<void> {
    this.passwordFormAction = action;
    const labelEl = getBySelector<HTMLLabelElement>(
      `label[for="two-fa-password-input"]`
    );

    switch (action) {
      case "setup":
        labelEl.textContent = i18next.t("settingsView.displayTwoFASetup");
        break;
      case "remove":
        labelEl.textContent = i18next.t("settingsView.deactivateTwoFASetup");
        break;
      case "backupCodes":
        labelEl.textContent = i18next.t(
          "settingsView.twoFAGenerateBackupCodes"
        );
        break;
    }

    this.twoFAModalEl.close();
    this.twoFAPasswordModalEl.showModal();
    this.twoFAPasswordInputEl.focus();
  }

  private async deleteProfile() {
    try {
      if (!confirm(i18next.t("settingsView.deleteProfileConfirm"))) return;
      getDataOrThrow(await deleteUser());
      auth.logoutOnProfileDeletion();
      toaster.success(i18next.t("toast.profileDeleteSuccess"));
    } catch (err) {
      viewLogger.error("Failed to delete profile:", err);
      toaster.error(i18next.t("toast.profileDeleteFailed"));
    }
  }
}
