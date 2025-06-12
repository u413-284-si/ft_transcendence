import AbstractView from "./AbstractView.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";

export default class SettingsView extends AbstractView {
  constructor() {
    super();
    this.setTitle("Settings");
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
