import { sanitizeHTML } from "./sanitize.js";
import { auth } from "./AuthManager.js";
import { Link } from "./components/Link.js";
import { Drawer } from "./Drawer.js";

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
      "bg-tron-grid text-white min-h-screen min-w-screen flex flex-col font-cyber tracking-widest uppercase";
  }

  private renderShell(): void {
    const html = this.getShellHTML();
    const cleanHTML = sanitizeHTML(html);
    this.rootEl.innerHTML = cleanHTML;
    this.attachAvatarDrawerHandler();
  }

  private getShellHTML(): string {
    return `
      <header class="bg-black text-teal py-8 shadow-lg border-b-1 border-teal/25">
        ${this.getHeaderHTML()}
      </header>
      <main id="app-content" class="flex-grow px-4 py-8"></main>
      <footer class="bg-black text-neon-cyan py-4 shadow-lg border-t-1 border-teal/25">
        ${this.getFooterHTML()}
      </footer>
    `;
  }

  private getHeaderHTML(): string {
    if (this.mode === "auth") {
      const userAvatarUrl: string =
        auth.getUser().avatar || "/images/default-avatar.png";
      return /* HTML */ ` <nav class="relative">
        <div class="container mx-auto flex justify-center space-x-8 ">
          ${Link({ text: i18next.t("home"), href: "/home" })}
          ${Link({ text: i18next.t("newGame"), href: "/newGame" })}
          ${Link({ text: i18next.t("newTournament"), href: "/newTournament" })}
          ${Link({ text: i18next.t("stats"), href: `/stats/${auth.getUser().username}` })}
          ${Link({ text: i18next.t("settings"), href: "/settings" })}
          ${Link({ text: i18next.t("friends"), href: "/friends" })}
        </div>
        <div
          class="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-2"
        >
          <img
            src="${userAvatarUrl}"
            alt="${i18next.t("avatar")}"
            tabindex="0"
            class="w-14 h-14 rounded-full border-3 border-white hover:border-neon-orange hover:animate-glow-border-orange shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
          />
        </div>
      </nav>`;
    }
    return /* HTML */ ` <nav>
      <div class="container mx-auto flex justify-center space-x-8">
        ${Link({ text: i18next.t("login"), href: "/login" })}
        ${Link({ text: i18next.t("register"), href: "/register" })}
      </div>
    </nav>`;
  }

  private getFooterHTML(): string {
    return /* HTML */ ` <div
      class="container mx-auto flex justify-center space-x-8"
    >
      <p class="text-sm">${i18next.t("pongGame")} &copy; 2025</p>
    </div>`;
  }

  private attachAvatarDrawerHandler(): void {
    const avatar = this.rootEl.querySelector<HTMLElement>("img[alt='Avatar']");
    if (!avatar) return;

    const drawer = new Drawer([
      { label: i18next.t("editProfile"), icon: "user", href: "/profile" },
      { label: i18next.t("stats"), icon: "stats", href: "/stats" },
      { label: i18next.t("friends"), icon: "friends", href: "/friends" },
      { label: i18next.t("settings"), icon: "settings", href: "/settings" },
      {
        label: i18next.t("logout"),
        icon: "logout",
        onClick: async () => {
          await auth.logout();
          this.update("guest");
        }
      }
    ]);

    avatar.addEventListener("click", () => drawer.open());
    avatar.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        drawer.open();
      }
    });
  }
}
