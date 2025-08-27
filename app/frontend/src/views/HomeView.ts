import AbstractView from "./AbstractView.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Header2 } from "../components/Header2.js";

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("homeView.title"));
  }

  createHTML() {
    return /* HTML */ `
      <div class="flex flex-col justify-center items-center gap-4 mb-12">
        ${Header1({
          text: `${i18next.t("homeView.title")}`,
          id: "home-header",
          variant: "default"
        })}
        ${Header2({
          text: i18next.t("homeView.helloUser", {
            username: escapeHTML(auth.getUser().username)
          }),
          variant: "default"
        })}
        ${Paragraph({
          text: i18next.t("homeView.tagline")
        })}

        <section
          class="w-4xl bg-emerald-dark/80 border border-neon-cyan rounded-lg shadow-neon-cyan p-6 space-y-4 mt-8"
        >
          ${Header2({
            text: i18next.t("homeView.faqTitle"),
            variant: "default"
          })}

          <!-- Accordion with details/summary -->
          <details class="group border-b border-grey pb-2">
            <summary
              class="flex justify-between items-center cursor-pointer py-2 text-xl font-medium text-neon-cyan"
            >
              ${i18next.t("homeView.faqGameModesTitle")}
              <span
                class="transition-transform group-open:rotate-45 text-neon-cyan"
                >+</span
              >
            </summary>
            <div class="mt-2 text-grey">
              <ul class="list-disc list-inside space-y-1">
                <li>${i18next.t("homeView.faqGameModesSingle")}</li>
                <li>${i18next.t("homeView.faqGameModesTournament")}</li>
              </ul>
            </div>
          </details>

          <details class="group border-b border-grey pb-2">
            <summary
              class="flex justify-between items-center cursor-pointer py-2 text-xl font-medium text-neon-cyan"
            >
              ${i18next.t("homeView.faqControlsTitle")}
              <span
                class="transition-transform group-open:rotate-45 text-neon-cyan"
                >+</span
              >
            </summary>
            <div class="mt-2 text-grey">
              <ul class="list-disc list-inside space-y-1">
                <li>${i18next.t("homeView.faqControlsRightPaddle")}</li>
                <li>${i18next.t("homeView.faqControlsLeftPaddle")}</li>
              </ul>
            </div>
          </details>

          <details class="group border-b border-grey pb-2">
            <summary
              class="flex justify-between items-center cursor-pointer py-2 text-xl font-medium text-neon-cyan"
            >
              ${i18next.t("homeView.faqTipsTitle")}
              <span
                class="transition-transform group-open:rotate-45 text-neon-cyan"
                >+</span
              >
            </summary>
            <div class="mt-2 text-grey">
              <ul class="list-disc list-inside space-y-1">
                <li>${i18next.t("homeView.faqTips1")}</li>
                <li>${i18next.t("homeView.faqTips2")}</li>
                <li>${i18next.t("homeView.faqTips3")}</li>
              </ul>
            </div>
          </details>

          <details class="group">
            <summary
              class="flex justify-between items-center cursor-pointer py-2 text-xl font-medium text-neon-cyan"
            >
              ${i18next.t("homeView.faqExtrasTitle")}
              <span
                class="transition-transform group-open:rotate-45 text-neon-cyan"
                >+</span
              >
            </summary>
            <div class="mt-2 text-grey">
              ${i18next.t("homeView.faqExtrasText")}
            </div>
          </details>
        </section>
      </div>
    `;
  }

  async render() {
    this.updateHTML();
  }

  getName(): string {
    return "home";
  }
}
