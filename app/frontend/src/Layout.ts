import { sanitizeHTML } from "./sanitize.js";
import { auth } from "./AuthManager.js";
import { Link } from "./components/Link.js";
import { Drawer } from "./Drawer.js";
import { LanguageSwitcher } from "./components/LanguageSwitcher.js";
import { Language } from "./types/User.js";
import { getById } from "./utility.js";

export type LayoutMode = "auth" | "guest";

export class Layout {
  private static instance: Layout;
  private mode: LayoutMode = "guest";
  private rootEl: HTMLElement;
  private languageSwitcherButtonEl!: HTMLElement;
  private languageSwitcherOptionsEl!: HTMLElement;

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

  public update(newMode: LayoutMode): void {
    this.mode = newMode;
    this.renderShell();
  }

  private styleRootElement(): void {
    this.rootEl.className =
      "bg-tron-grid text-white min-h-screen min-w-screen flex flex-col font-cyber tracking-widest uppercase";
  }

  private renderShell(): void {
    document.removeEventListener("click", this.onDocumentClick);

    const html = this.getShellHTML();
    const cleanHTML = sanitizeHTML(html);
    this.rootEl.innerHTML = cleanHTML;

    this.attachAvatarDrawerHandler();
    this.languageSwitcherButtonEl = getById<HTMLButtonElement>(
      "lang-switcher-button"
    )!;
    this.languageSwitcherOptionsEl = getById("lang-switcher-options")!;
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
          ${Link({ text: i18next.t("homeView.title"), href: "/home" })}
          ${Link({
            text: i18next.t("newGameView.title"),
            href: "/newGame"
          })}
          ${Link({
            text: i18next.t("newTournamentView.title"),
            href: "/newTournament"
          })}
        </div>
        <div
          class="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-8"
        >
          ${LanguageSwitcher({
            id: "lang-switcher",
            selectedLang: i18next.language as Language
          })}
          <img
            id="user-avatar"
            src="${userAvatarUrl}"
            alt="${i18next.t("global.avatar")}"
            tabindex="0"
            class="w-14 h-14 rounded-full border-3 border-neon-cyan shadow-neon-cyan hover:border-neon-orange hover:animate-glow-border-orange shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
          />
        </div>
      </nav>`;
    }
    return /* HTML */ ` <nav>
      <div class="container mx-auto flex justify-center space-x-8">
        ${Link({ text: i18next.t("loginView.title"), href: "/login" })}
        ${Link({
          text: i18next.t("registerView.title"),
          href: "/register"
        })}
        <div class="absolute top-0 py-8 right-4 flex items-center space-x-8">
          ${LanguageSwitcher({
            id: "lang-switcher",
            selectedLang: i18next.language as Language
          })}
        </div>
      </div>
    </nav>`;
  }

  private getFooterHTML(): string {
    return /* HTML */ ` <div
      class="container mx-auto flex justify-center space-x-8"
    >
      <p class="text-sm">${i18next.t("global.pongGame")} &copy; 2025</p>
    </div>`;
  }

  private attachAvatarDrawerHandler(): void {
    const avatar = this.rootEl.querySelector<HTMLElement>("#user-avatar");
    if (!avatar) return;

    const drawer = new Drawer([
      {
        label: i18next.t("global.editProfile"),
        icon: "user",
        href: "/profile"
      },
      {
        label: i18next.t("statsView.title"),
        icon: "stats",
        href: `/stats/${auth.getUser().username}`
      },
      {
        label: i18next.t("friendsView.title"),
        icon: "friends",
        href: "/friends"
      },
      {
        label: i18next.t("settingsView.title"),
        icon: "settings",
        href: "/settings"
      },
      {
        label: i18next.t("global.logout"),
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

  private onDocumentClick = (event: MouseEvent) => {
    if (
      !this.languageSwitcherButtonEl.contains(event.target as Node) &&
      !this.languageSwitcherOptionsEl.contains(event.target as Node)
    ) {
      this.languageSwitcherOptionsEl.classList.add("hidden");
    }
  };

  private attachLanguageSwitcherHandler(): void {
    if (!this.languageSwitcherButtonEl || !this.languageSwitcherOptionsEl)
      return;

    this.languageSwitcherButtonEl.addEventListener("click", () => {
      this.languageSwitcherOptionsEl.classList.toggle("hidden");
    });

    this.languageSwitcherOptionsEl
      .querySelectorAll("button[data-lang]")
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const lang = (e.currentTarget as HTMLElement).dataset
            .lang as Language;
          await auth.updateLanguage(lang);
        });
      });

    document.addEventListener("click", this.onDocumentClick);
  }
}

export const layout = Layout.getInstance();
