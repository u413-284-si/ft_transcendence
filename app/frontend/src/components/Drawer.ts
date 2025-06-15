import { auth } from "../AuthManager.js";

export type DrawerItem = { label: string; href?: string; onClick?: () => void };

export class Drawer {
  private links: DrawerItem[];
  private drawerEl: HTMLElement;
  private overlayEl: HTMLElement;

  constructor(links: DrawerItem[]) {
    this.links = links;
    this.drawerEl = this.createDrawer();
    this.overlayEl = this.createOverlay();

    document.body.appendChild(this.drawerEl);
    document.body.appendChild(this.overlayEl);
    this.hide(); // Start hidden
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

  private createDrawer(): HTMLElement {
    const aside = document.createElement("aside");
    aside.className =
      "fixed top-0 right-0 h-full w-64 bg-black text-cyan-300 z-50 shadow-lg transform transition-transform duration-300 translate-x-full";

    const container = document.createElement("div");
    container.className = "p-6 space-y-4";

    const avatarImg = document.createElement("img");
    avatarImg.src = auth.getUser().avatar || "/images/default-avatar.png";
    avatarImg.alt = "User avatar";
    avatarImg.className =
      "w-20 h-20 rounded-full border-2 border-white mx-auto shadow";
    container.appendChild(avatarImg);

    const heading = document.createElement("h2");
    heading.textContent = auth.getUser().username;
    heading.className = "text-xl font-bold mx-auto text-center";
    container.appendChild(heading);

    const linkContainer = document.createElement("div");
    linkContainer.className = "mt-12 space-y-2";

    for (const { label, href, onClick } of this.links) {
      const link = document.createElement("a");
      link.href = href || "#";
      link.textContent = label;
      link.setAttribute("data-link", "");
      link.className = "block hover:underline text-left px-4";

      if (onClick) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          onClick();
          this.close();
        });
      }

      linkContainer.appendChild(link);
    }

    container.appendChild(linkContainer);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "mt-4 text-red-500 hover:underline px-4";
    closeBtn.addEventListener("click", () => this.close());
    container.appendChild(closeBtn);

    aside.appendChild(container);
    return aside;
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black/20 z-40 hidden";
    overlay.addEventListener("click", () => this.close());
    return overlay;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.close();
  };
}
