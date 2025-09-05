import AbstractView from "./AbstractView.js";
import { ApiError } from "../services/api.js";
import { router } from "../routing/Router.js";
import { Header1 } from "../components/Header1.js";
import { Paragraph } from "../components/Paragraph.js";
import { Button } from "../components/Button.js";
import { getById } from "../utility.js";

export default class ErrorView extends AbstractView {
  private message: string = i18next.t("error.unexpected");
  private status: string = "500";
  private cause: string | undefined;

  constructor(error: unknown) {
    super();
    this.setTitle();
    this.parseError(error);
  }

  private parseError(error: unknown): void {
    if (error instanceof ApiError) {
      this.message = error.message;
      this.status = String(error.status);
      this.cause = error.cause;
    } else if (error instanceof Error) {
      this.message = error.message;
    } else if (typeof error === "string") {
      this.message = error;
    }
  }

  createHTML() {
    return /* HTML */ `
      ${Header1({
        text: i18next.t("errorView.errorStatus", { status: this.status }),
        id: "error-header",
        variant: "error"
      })}
      ${Paragraph({ text: `${this.message}`, id: "error-message", size: "lg" })}
      ${this.cause
        ? `${Paragraph({ text: i18next.t("errorView.details", { cause: this.cause }), id: "error-cause" })}`
        : ""}
      ${Button({
        id: "reload-btn",
        text: i18next.t("errorView.reload"),
        variant: "default",
        size: "md",
        type: "button",
        className: "mt-8"
      })}
    `;
  }

  protected addListeners(): void {
    const reloadBtn = getById<HTMLButtonElement>("reload-btn");
    reloadBtn.addEventListener("click", () => {
      router.reload();
    });
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return i18next.t("errorView.title");
  }
}
