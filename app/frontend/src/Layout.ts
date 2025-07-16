import { sanitizeHTML } from "./sanitize.js";
import { auth } from "./AuthManager.js";
import { Link } from "./components/Link.js";
import { Drawer } from "./Drawer.js";
import { LanguageSwitcher } from "./components/LanguageSwitcher.js";
import { router } from "./routing/Router.js";

export type LayoutMode = "auth" | "guest";

export class Layout {
  private static instance: Layout;
  private mode: LayoutMode = "guest";
  private rootEl: HTMLElement;

  constructor() {
    this.rootEl = document.getElementById("app")!;
    this.styleRootElement();
  }

  public static getInstance(): Layout {
    if (!Layout.instance) {
      Layout.instance = new Layout();
    }
    return Layout.instance;
  }

  public initialize(): void {
    this.renderShell();
  }

  public update(newMode: LayoutMode): void {
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
    this.attachLanguageSwitcherHandler();
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
          ${Link({ text: i18next.t("homeView.homeTitle"), href: "/home" })}
          ${Link({
            text: i18next.t("newGameView.newGameTitle"),
            href: "/newGame"
          })}
          ${Link({
            text: i18next.t("newTournamentView.newTournamentTitle"),
            href: "/newTournament"
          })}
        </div>
        <div
          class="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-8"
        >
          ${LanguageSwitcher({
            id: "lang-switcher",
            selectedLang: i18next.language as "en" | "fr" | "de" | "pi"
          })}
          <img
            id="user-avatar"
            src="${userAvatarUrl}"
            alt="${i18next.t("global.avatarText")}"
            tabindex="0"
            class="w-14 h-14 rounded-full border-3 border-neon-cyan shadow-neon-cyan hover:border-neon-orange hover:animate-glow-border-orange shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
          />
        </div>
      </nav>`;
    }
    return /* HTML */ ` <nav>
      <div class="container mx-auto flex justify-center space-x-8">
        ${Link({ text: i18next.t("loginView.loginTitle"), href: "/login" })}
        ${Link({
          text: i18next.t("registerView.registerTitle"),
          href: "/register"
        })}
        <div class="absolute top-4 right-4">
          ${LanguageSwitcher({
            id: "lang-switcher",
            selectedLang: i18next.language as "en" | "fr" | "de" | "pi"
          })}
        </div>
      </div>
    </nav>`;
  }

  private getFooterHTML(): string {
    return /* HTML */ ` <div
      class="container mx-auto flex justify-center space-x-8"
    >
      <p class="text-sm">${i18next.t("global.pongGameText")} &copy; 2025</p>
    </div>`;
  }

  private attachAvatarDrawerHandler(): void {
    const avatar = this.rootEl.querySelector<HTMLElement>("#user-avatar");
    if (!avatar) return;

    const drawer = new Drawer([
      {
        label: i18next.t("global.editProfileText"),
        icon: "user",
        href: "/profile"
      },
      {
        label: i18next.t("statsView.statsTitle"),
        icon: "stats",
        href: `/stats/${auth.getUser().username}`
      },
      {
        label: i18next.t("friendsView.friendsTitle"),
        icon: "friends",
        href: "/friends"
      },
      {
        label: i18next.t("settingsView.settingsTitle"),
        icon: "settings",
        href: "/settings"
      },
      {
        label: i18next.t("global.logoutText"),
        icon: "logout",
        onClick: async () => {
          await auth.logout();
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

  private switchLanguage(lang: "en" | "fr" | "de" | "pi"): void {
    i18next.changeLanguage(lang).then(() => {
      this.renderShell();
      router.reload();
      console.info(`Language switched to ${lang}`);
    });
  }

  private attachLanguageSwitcherHandler(): void {
    const select =
      this.rootEl.querySelector<HTMLSelectElement>("#lang-switcher");
    if (!select) return;

    select.addEventListener("change", (event) => {
      const lang = (event.target as HTMLSelectElement).value as
        | "en"
        | "fr"
        | "de"
        | "pi";
      this.switchLanguage(lang);
    });
  }
}

export const layout = Layout.getInstance();
