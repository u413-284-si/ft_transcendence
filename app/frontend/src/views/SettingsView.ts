import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";

export default class SettingsView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("settingsTitle"));
  }

  createHTML() {
    return /* HTML */ `
      <div class="text-center space-y-4">
        ${Header1({
          text: i18next.t("settingsHeader"),
          variant: "default"
        })}
        ${Paragraph({
          text: i18next.t("settingsIntro"),
          id: "settings-intro"
        })}
      </div>
    `;
  }

  async render() {
    this.updateHTML();
  }

  getName(): string {
    return "settings";
  }
}
