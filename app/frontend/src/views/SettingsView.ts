import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Form } from "../components/Form.js";
import { Button } from "../components/Button.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { patchUser } from "../services/userServices.js";
import { toaster } from "../Toaster.js";
import { auth } from "../AuthManager.js";
import { router } from "../routing/Router.js";
import { User } from "../types/User.js";
import { ApiError } from "../services/api.js";
import { layout } from "../Layout.js";

export default class SettingsView extends AbstractView {
  private preferredLanguageFormEl!: HTMLFormElement;
  private preferredLanguageButtonEl!: HTMLElement;
  private preferredLanguageOptionsEl!: HTMLElement;
  private selectedLanguage: "en" | "fr" | "de" | "pi" | "tr" = i18next.language as
    | "en"
    | "fr"
    | "de"
    | "pi"
    | "tr";

  constructor() {
    super();
    this.setTitle(i18next.t("settingsView.settingsTitle"));
  }

  createHTML() {
    return /* HTML */ `
      <div class="text-center space-y-4">
        ${Header1({
          text: i18next.t("settingsView.settingsTitle"),
          variant: "default"
        })}
        ${Paragraph({
          text: i18next.t("settingsView.settingsText"),
          id: "settings-intro"
        })}
        <div class="mt-24 text-center inline-block">
          ${Form({
            id: "preferred-language-form",
            className: "flex flex-col gap-4",
            children: [
              Paragraph({
                text: i18next.t("settingsView.preferredLanguageText")
              }),
              `<div class="flex flex-wrap items-end gap-4 mt-2">
                ${LanguageSwitcher({
                  id: "preferred-language",
                  selectedLang: i18next.language as "en" | "fr" | "de" | "pi" | "tr",
                  className: "w-64",
                  size: "lg"
                })}
                ${Button({
                  text: i18next.t("settingsView.saveLanguageText"),
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

  async render() {
    this.updateHTML();
    this.preferredLanguageFormEl = document.querySelector<HTMLFormElement>(
      "#preferred-language-form"
    )!;
    this.preferredLanguageButtonEl = document.querySelector<HTMLElement>(
      "#preferred-language-button"
    )!;
    this.preferredLanguageOptionsEl = document.querySelector<HTMLElement>(
      "#preferred-language-options"
    )!;
    this.addListeners();
  }

  protected addListeners() {
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
          const lang = (e.currentTarget as HTMLElement).dataset.lang as
            | "en"
            | "fr"
            | "de"
            | "pi"
            | "tr";
          this.switchLanguage(lang);
        });
      });

    document.addEventListener("click", (event) => {
      if (
        !this.preferredLanguageButtonEl.contains(event.target as Node) &&
        !this.preferredLanguageOptionsEl.contains(event.target as Node)
      ) {
        this.preferredLanguageOptionsEl.classList.add("hidden");
      }
    });
  }

  private async updatePreferredLanguage(event: Event): Promise<void> {
    event.preventDefault();

    const updatedUser: Partial<User> = {
      ...(this.selectedLanguage ? { language: this.selectedLanguage } : {})
    };

    try {
      await patchUser(updatedUser);
      toaster.success(i18next.t("profileView.profileUpdatedSuccessText"));
      auth.updateUser(updatedUser);
      router.reload();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toaster.error(i18next.t("registerView.emailOrUsernameExistsText"));
        return;
      }
      toaster.error(i18next.t("profileView.profileUpdateFailedText"));
      router.handleError("Error in patchUser()", err);
    }
  }

  private switchLanguage(lang: "en" | "fr" | "de" | "pi" | "tr"): void {
    this.selectedLanguage = lang;
    i18next.changeLanguage(lang).then(() => {
      localStorage.setItem("preferredLanguage", lang);
      layout.update("auth");
      router.reload();
      console.info(`Language switched to ${lang}`);
    });
  }

  getName(): string {
    return "settings";
  }
}
