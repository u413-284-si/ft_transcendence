import AbstractView from "./AbstractView.js";
import { ApiError } from "../services/api.js";

export default class ErrorView extends AbstractView {
  private message: string = "An unexpected error occurred.";
  private status: string = "500";
  private cause: string | undefined;

  constructor(error: unknown) {
    super();
    this.setTitle("Error");
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
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();

    return /* HTML */ `
      ${navbarHTML}
      <main class="p-6 flex flex-col items-center justify-center text-center">
        <div class="bg-red-100 p-6 rounded-xl shadow-md">
          <h1 class="text-3xl font-bold text-red-700">
            ⚠️ Error ${this.status}
          </h1>
          <p class="mt-2 text-gray-700">${this.message}</p>
          ${this.cause
            ? `<p class="mt-2 text-sm text-gray-500">Details: ${this.cause}</p>`
            : ""}
          <div class="mt-4">
            <button onclick="history.back()" class="text-blue-500 underline">
              Go Back
            </button>
            <a href="/" class="ml-4 text-blue-500 underline">Home</a>
          </div>
        </div>
      </main>
      ${footerHTML}
    `;
  }

  async render() {
    this.updateHTML();
  }

  getName(): string {
    return "error";
  }
}
