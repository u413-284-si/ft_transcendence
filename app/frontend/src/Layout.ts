import { sanitizeHTML } from "./sanitize.js";
import { getUserProfile } from "./services/userServices.js";

export type LayoutMode = "auth" | "guest";

export class Layout {
  private mode: LayoutMode;
  private rootEl: HTMLElement;

  constructor(initialMode: LayoutMode) {
    this.mode = initialMode;
    this.rootEl = document.getElementById("app")!;
    this.styleRootElement();
    this.renderShell();
  }

  public update(newMode: LayoutMode): void {
    if (this.mode === newMode) return;
    this.mode = newMode;
    this.renderShell();
  }

  private styleRootElement(): void {
    this.rootEl.className =
      "bg-blue-900 text-white min-h-screen min-w-screen flex flex-col font-mono";
  }

  private async renderShell(): Promise<void> {
    const html = await this.getShellHTML();
    const cleanHTML = sanitizeHTML(html);
    this.rootEl.innerHTML = cleanHTML;
  }

  private async getShellHTML(): Promise<string> {
    return `
      <header class="bg-blue-800 text-white py-8 shadow-lg">${await this.getHeaderHTML()}</header>
      <main id="app-content" class="flex-grow px-4 py-8"></main>
      <footer class="bg-blue-800 text-white py-4 shadow-lg">${this.getFooterHTML()}</footer>
    `;
  }

  private async getHeaderHTML(): Promise<string> {
    if (this.mode === "auth") {
      const user = await getUserProfile();
      const avatarUrl = user.avatar || "/images/default-avatar.png";
      return /* HTML */ ` <nav class="relative">
        <div class="container mx-auto flex justify-center space-x-8">
          <a href="/home" class="text-xl hover:text-blue-300" data-link>Home</a>
          <a href="/newGame" class="text-xl hover:text-blue-300" data-link
            >New Game</a
          >
          <a href="/newTournament" class="text-xl hover:text-blue-300" data-link
            >New Tournament</a
          >
          <a href="/stats" class="text-xl hover:text-blue-300" data-link
            >Stats</a
          >
          <a href="/settings" class="text-xl hover:text-blue-300" data-link
            >Settings</a
          >
          <a href="/friends" class="text-xl hover:text-blue-300" data-link
            >Friends</a
          >
        </div>
        <div
          class="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-2"
        >
          <img
            src="${avatarUrl}"
            alt="Avatar"
            class="w-14 h-14 rounded-full border-2 border-white shadow"
          />
        </div>
      </nav>`;
    }
    return /* HTML */ `<nav>
      <div class="container mx-auto flex justify-center space-x-8">
        <a href="/login" class="text-lg hover:text-blue-300" data-link>Login</a>
        <a href="/register" class="text-lg hover:text-blue-300" data-link
          >Register</a
        >
      </div>
    </nav>`;
  }

  private getFooterHTML(): string {
    return /* HTML */ `<div
      class="container mx-auto flex justify-center space-x-8"
    >
      <p class="text-sm">Pong Game &copy; 2025</p>
    </div>`;
  }
}
