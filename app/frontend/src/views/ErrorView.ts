import AbstractView from "./AbstractView.js";
import { ApiError } from "../services/api.js";

export default class ErrorView extends AbstractView {
  private error: unknown;

  constructor(error: unknown) {
    super();
    this.setTitle("Error");
    this.error = error;
  }

  private parseError(): { message: string; status: string; cause?: string } {
    let message = "An unexpected error occurred.";
    let status = "500";
    let cause: string | undefined;

    const error = this.error;

    if (error instanceof ApiError) {
      message = error.message;
      status = String(error.status);
      cause = error.cause;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    return { message, status, cause };
  }

  createHTML() {
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();
    const { message, status, cause } = this.parseError();

    return /* HTML */ `
      ${navbarHTML}
      <main class="p-6 flex flex-col items-center justify-center text-center">
        <div class="bg-red-100 p-6 rounded-xl shadow-md">
          <h1 class="text-3xl font-bold text-red-700">⚠️ Error ${status}</h1>
          <p class="mt-2 text-gray-700">${message}</p>
          ${cause
            ? `<p class="mt-2 text-sm text-gray-500">Details: ${cause}</p>`
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
