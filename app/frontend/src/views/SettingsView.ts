import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Form } from "../components/Form.js";
import { Button } from "../components/Button.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { patchUser } from "../services/userServices.js";
import { toaster } from "../Toaster.js";
import { auth } from "../AuthManager.js";
import { User, Language } from "../types/User.js";
import { getButtonEl, getEl } from "../utility.js";
import { getDataOrThrow } from "../services/api.js";

export default class SettingsView extends AbstractView {
  private preferredLanguageFormEl!: HTMLFormElement;
  private preferredLanguageButtonEl!: HTMLElement;
  private preferredLanguageOptionsEl!: HTMLElement;
  private selectedLanguage: Language = i18next.language as Language;

  constructor() {
    super();
    this.setTitle(i18next.t("settingsView.title"));
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

  async render() {
    this.updateHTML();
    this.preferredLanguageFormEl = document.querySelector<HTMLFormElement>(
      "#preferred-language-form"
    )!;
    this.preferredLanguageButtonEl = getButtonEl("preferred-language-button")!;
    this.preferredLanguageOptionsEl = getEl("preferred-language-options")!;
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
        btn.addEventListener("click", async (e) => {
          const lang = (e.currentTarget as HTMLElement).dataset
            .lang as Language;
          await auth.updateLanguage(lang);
        });
      });

    document.addEventListener("click", this.onDocumentClick);
  }

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
      await auth.updateUser(updatedUser);
    } catch (err) {
      console.error("Failed to update preferred language:", err);
      toaster.error(i18next.t("toast.profileUpdateFailed"));
    }
  }

  getName(): string {
    return "settings";
  }
}
