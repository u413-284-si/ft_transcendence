import { auth } from "./AuthManager.js";
import { Sidebar } from "./components/Sidebar.js";
import { Overlay } from "./components/Overlay.js";
import { sanitizeHTML } from "./sanitize.js";
import { router } from "./routing/Router.js";
import { getById } from "./utility.js";

export type DrawerItem = {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
};

export class Drawer {
  private drawerEl: HTMLElement;
  private overlayEl: HTMLElement;

  constructor(private links: DrawerItem[]) {
    const user = auth.getUser();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = sanitizeHTML(Sidebar(user, links));
    this.drawerEl = wrapper.firstElementChild as HTMLElement;

    const overlayWrapper = document.createElement("div");
    overlayWrapper.innerHTML = sanitizeHTML(Overlay());
    this.overlayEl = overlayWrapper.firstElementChild as HTMLElement;

    document.body.appendChild(this.drawerEl);
    document.body.appendChild(this.overlayEl);

    this.bindEvents();
    this.hide();
  }

  public open() {
    this.drawerEl.classList.remove("hidden");
    this.drawerEl.classList.remove("translate-x-full");
    this.overlayEl.classList.remove("hidden");
    this.drawerEl.focus();
    document.addEventListener("keydown", this.onKeyDown);
  }

  public close() {
    this.drawerEl.classList.add("translate-x-full");
    this.drawerEl.classList.add("hidden");
    this.overlayEl.classList.add("hidden");
    document.removeEventListener("keydown", this.onKeyDown);
  }

  private hide() {
    this.drawerEl.classList.add("translate-x-full");
    this.overlayEl.classList.add("hidden");
  }

  private onLinkClick = (item: DrawerItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.navigate(item.href);
    }
    this.close();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
      return;
    }

    if (e.key === "Tab") {
      const focusableEls = this.drawerEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const focusable = Array.from(focusableEls).filter(
        (el) => el.offsetParent !== null
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  private bindEvents() {
    this.drawerEl
      .querySelectorAll<HTMLElement>("[data-label]")
      .forEach((el) => {
        el.addEventListener("click", () => {
          const label = el.getAttribute("data-label");
          const item = this.links.find((l) => l.label === label);
          if (item) this.onLinkClick(item);
        });

        el.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const label = el.getAttribute("data-label");
            const item = this.links.find((l) => l.label === label);
            if (item) this.onLinkClick(item);
          }
        });
      });

    const closeBtn = getById<HTMLButtonElement>("drawer-close");
    closeBtn.addEventListener("click", () => this.close());

    this.overlayEl.addEventListener("click", () => this.close());
  }
}
