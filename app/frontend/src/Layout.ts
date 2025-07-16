import { sanitizeHTML } from "./sanitize.js";
import { auth } from "./AuthManager.js";
import { Link } from "./components/Link.js";
import { Drawer } from "./Drawer.js";
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
    const langSwitcher = `
    <select id="lang-switcher" class="bg-black text-teal border border-teal rounded px-2 py-1 text-sm focus:outline-none">
      <option value="en" ${i18next.language === "en" ? "selected" : ""}>EN</option>
      <option value="fr" ${i18next.language === "fr" ? "selected" : ""}>FR</option>
    </select>
  `;

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
          class="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-2"
        >
          ${langSwitcher}
          <img
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
        ${langSwitcher}
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
    const avatar = this.rootEl.querySelector<HTMLElement>("img[alt='Avatar']");
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

  private switchLanguage(lang: "en" | "fr"): void {
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
      const lang = (event.target as HTMLSelectElement).value as "en" | "fr";
      this.switchLanguage(lang);
    });
  }
}

export const layout = Layout.getInstance();
