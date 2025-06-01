import AbstractView from "./AbstractView.js";
import { ApiError } from "../services/api.js";
import { router } from "../routing/Router.js";

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
    return /* HTML */ `
      <main class="p-6 flex flex-col items-center justify-center text-center">
        <div class="bg-red-100 p-6 rounded-xl shadow-md">
          <h1 class="text-3xl font-bold text-red-700">
            ⚠️ Error ${this.status}
          </h1>
          <p class="mt-2 text-gray-700">${this.message}</p>
          ${this.cause
            ? `<p class="mt-2 text-sm text-gray-500">Details: ${this.cause}</p>`
            : ""}
          <div class="mt-4 space-x-4">
            <button
              id="home-btn"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
            >
              Reload
            </button>
          </div>
        </div>
      </main>
    `;
  }

  protected addListeners(): void {
    document.getElementById("home-btn")!.addEventListener("click", () => {
      router.reload();
    });
  }

  async render() {
    this.updateHTML();
    this.addListeners();
  }

  getName(): string {
    return "error";
  }
}
