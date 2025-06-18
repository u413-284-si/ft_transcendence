import { auth } from "./AuthManager.js";
import { Sidebar } from "./components/Sidebar.js";
import { Overlay } from "./components/Overlay.js";
import { sanitizeHTML } from "./sanitize.js";

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
    wrapper.innerHTML = sanitizeHTML((Sidebar(user, links)));
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
    this.drawerEl.classList.remove("translate-x-full");
    this.overlayEl.classList.remove("hidden");
    document.addEventListener("keydown", this.onKeyDown);
  }

  public close() {
    this.drawerEl.classList.add("translate-x-full");
    this.overlayEl.classList.add("hidden");
    document.removeEventListener("keydown", this.onKeyDown);
  }

  private hide() {
    this.drawerEl.classList.add("translate-x-full");
    this.overlayEl.classList.add("hidden");
  }

  private onLinkClick = (item: DrawerItem) => {
    item.onClick?.();
    this.close();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.close();
  };

  private bindEvents() {
    this.drawerEl.querySelectorAll("[data-label]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const label = el.getAttribute("data-label");
        const item = this.links.find((l) => l.label === label);
        if (item) this.onLinkClick(item);
      });
    });

    const closeBtn = this.drawerEl.querySelector("#drawer-close");
    closeBtn?.addEventListener("click", () => this.close());

    this.overlayEl.addEventListener("click", () => this.close());
  }
}
