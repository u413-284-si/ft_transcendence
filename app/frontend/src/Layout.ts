import { sanitizeHTML } from "./sanitize.js";
import { auth } from "./AuthManager.js";

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
      "bg-tron-grid text-cyan-300 min-h-screen min-w-screen flex flex-col font-cyber tracking-widest uppercase";
  }

  private renderShell(): void {
    const html = this.getShellHTML();
    const cleanHTML = sanitizeHTML(html);
    this.rootEl.innerHTML = cleanHTML;
  }

  private getShellHTML(): string {
    return `
      <header class="bg-black text-cyan-300 py-8 shadow-lg border-b-1 border-cyan-500/25">
        ${this.getHeaderHTML()}
      </header>
      <main id="app-content" class="flex-grow px-4 py-8"></main>
      <footer class="bg-black text-cyan-300 py-4 shadow-lg border-t-1 border-cyan-500/25">
        ${this.getFooterHTML()}
      </footer>
    `;
  }

  private getHeaderHTML(): string {
    if (this.mode === "auth") {
      const userAvatarUrl: string =
        auth.getUser().avatar || "/images/default-avatar.png";
      return /* HTML */ ` <nav class="relative">
        <div class="container mx-auto flex justify-center space-x-8">
          <a
            href="/home"
            class="text-xl hover:text-neon-orange hover:animate-neonOrange"
            data-link
            >Home</a
          >
          <a
            href="/newGame"
            class="text-xl hover:text-neon-orange hover:animate-neonOrange"
            data-link
            >New Game</a
          >
          <a
            href="/newTournament"
            class="text-xl hover:text-neon-orange hover:animate-neonOrange"
            data-link
            >New Tournament</a
          >
          <a
            href="/stats"
            class="text-xl hover:text-neon-orange hover:animate-neonOrange"
            data-link
            >Stats</a
          >
          <a
            href="/settings"
            class="text-xl hover:text-neon-orange hover:animate-neonOrange"
            data-link
            >Settings</a
          >
          <a
            href="/friends"
            class="text-xl hover:text-neon-orange hover:animate-neonOrange"
            data-link
            >Friends</a
          >
        </div>
        <div
          class="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-2"
        >
          <img
            src="${userAvatarUrl}"
            alt="Avatar"
            class="w-14 h-14 rounded-full border-2 border-neon-orange shadow-lg"
          />
        </div>
      </nav>`;
    }
    return /* HTML */ ` <nav>
      <div class="container mx-auto flex justify-center space-x-8">
        <a href="/login" class="text-lg hover:text-orange-400" data-link
          >Login</a
        >
        <a href="/register" class="text-lg hover:text-orange-400" data-link
          >Register</a
        >
      </div>
    </nav>`;
  }

  private getFooterHTML(): string {
    return /* HTML */ ` <div
      class="container mx-auto flex justify-center space-x-8"
    >
      <p class="text-sm">Pong Game &copy; 2025</p>
    </div>`;
  }
}
