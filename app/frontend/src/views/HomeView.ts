import AbstractView from "./AbstractView.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Header2 } from "../components/Header2.js";
import { Details } from "../components/Details.js";
import { List } from "../components/List.js";

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
          text: i18next.t("homeView.tagline"),
          size: "lg"
        })}

        <section
          class="w-4xl bg-emerald-dark/80 border border-neon-cyan rounded-lg shadow-neon-cyan p-6 space-y-4 mt-8"
        >
          ${Header2({
            text: i18next.t("homeView.faqTitle"),
            variant: "default"
          })}

          <!-- Accordion with details/summary -->
          ${Details({
            summary: i18next.t("homeView.faqGameModesTitle"),
            content: List({
              type: "unordered",
              children: [
                i18next.t("homeView.faqGameModesSingle"),
                i18next.t("homeView.faqGameModesTournament")
              ]
            })
          })}
          ${Details({
            summary: i18next.t("homeView.faqControlsTitle"),
            content: List({
              type: "unordered",
              children: [
                i18next.t("homeView.faqControlsRightPaddle"),
                i18next.t("homeView.faqControlsLeftPaddle")
              ]
            })
          })}
          ${Details({
            summary: i18next.t("homeView.faqTipsTitle"),
            content: List({
              type: "unordered",
              children: [
                i18next.t("homeView.faqTips1"),
                i18next.t("homeView.faqTips2"),
                i18next.t("homeView.faqTips3")
              ]
            })
          })}
          ${Details({
            summary: i18next.t("homeView.faqExtrasTitle"),
            content: Paragraph({
              text: i18next.t("homeView.faqExtrasText")
            })
          })}
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
