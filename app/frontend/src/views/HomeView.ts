import AbstractView from "./AbstractView.js";
import { auth } from "../AuthManager.js";
import { escapeHTML } from "../utility.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { toaster } from "../Toaster.js";

export default class HomeView extends AbstractView {
  constructor() {
    super();
    this.setTitle(i18next.t("homeView.homeTitle"));
  }

  createHTML() {
    return /* HTML */ `
      <div class="flex flex-col justify-center items-center gap-4 mb-12">
        ${Header1({
          text: `${i18next.t("homeView.homeTitle")}`,
          id: "home-header",
          variant: "default"
        })}
        ${Paragraph({
          text: i18next.t("homeView.helloUser", { username: escapeHTML(auth.getUser().username) })
        })}
      </div>

      <div>
        <h1 class="mt-12">Test Buttons for toast</h1>
        <button id="button1" class="px-6 py-3 bg-green-500 text-white rounded">
          Success
        </button>
        <button id="button2" class="px-6 py-3 bg-red-500 text-white rounded">
          Error
        </button>
        <button id="button3" class="px-6 py-3 bg-yellow-500 text-white rounded">
          Warning
        </button>
        <button id="button4" class="px-6 py-3 bg-blue-500 text-white rounded">
          Info
        </button>
      </div>
    `;
  }

  protected addListeners() {
    document.getElementById("button1")!.addEventListener("click", () => {
      toaster.success("This is a succesful toast");
    });
    document.getElementById("button2")!.addEventListener("click", () => {
      toaster.error("This is an error toast");
    });
    document.getElementById("button3")!.addEventListener("click", () => {
      toaster.warn(
        "A warning toast which is very long text so it will have a text break"
      );
    });
    document.getElementById("button4")!.addEventListener("click", () => {
      toaster.info("A info toast to show that something happened");
    });
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "home";
  }
}
