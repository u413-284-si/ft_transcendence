import { auth } from "../AuthManager.js";

export type DrawerItem = {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
};

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
      "fixed top-0 right-0 h-full w-75 bg-emerald-dark text-neon-cyan border-l-2 border-emerald-light rounded-l-2xl z-40 shadow-lg transform transition-transform duration-300 translate-x-full";

    const container = document.createElement("div");
    container.className = "p-6 space-y-4";

    const avatarImg = document.createElement("img");
    avatarImg.src = auth.getUser().avatar || "/images/default-avatar.png";
    avatarImg.alt = "User avatar";
    avatarImg.className =
      "w-20 h-20 rounded-full border-3 border-white mx-auto shadow";
    container.appendChild(avatarImg);

    const heading = document.createElement("h2");
    heading.textContent = auth.getUser().username;
    heading.className = "text-xl font-bold mx-auto text-center";
    container.appendChild(heading);

    const linkContainer = document.createElement("div");
    linkContainer.className = "mt-12 space-y-2";

    for (const { label, icon, href, onClick } of this.links) {
      const wrapper = document.createElement("div");
      wrapper.className =
        "flex items-center space-x-2 px-4 hover:underline text-left cursor-pointer";
      const link = document.createElement("a");
      if (href) link.href = href;
      link.setAttribute("data-link", "");

      if (icon) {
        const iconEl = this.createIcon(icon);
        wrapper.appendChild(iconEl);
      }

      wrapper.appendChild(link);

      const labelSpan = document.createElement("span");
      labelSpan.textContent = label;
      link.appendChild(labelSpan);

      if (onClick) {
        wrapper.addEventListener("click", (e) => {
          e.preventDefault();
          onClick();
          this.close();
        });
      }

      linkContainer.appendChild(wrapper);
    }

    container.appendChild(linkContainer);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.className = "mt-4 text-red-500 hover:underline px-4 cursor-pointer";
    closeBtn.addEventListener("click", () => this.close());
    container.appendChild(closeBtn);

    aside.appendChild(container);
    return aside;
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black/30 z-30 hidden";
    overlay.addEventListener("click", () => this.close());
    return overlay;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.close();
  };

  private createIcon(name: string): SVGSVGElement {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("w-5", "h-5", "text-neon-cyan", "shrink-0");

    const paths = this.getIconPaths(name, ns);
    for (const path of paths) {
      svg.appendChild(path);
    }

    return svg;
  }

  private getIconPaths(name: string, ns: string): SVGPathElement[] {
    const createPath = (d: string): SVGPathElement => {
      const path = document.createElementNS(ns, "path") as SVGPathElement;
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("d", d);
      return path;
    };

    switch (name) {
      case "user":
        return [
          createPath("M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"),
          createPath(
            "M4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          )
        ];
      case "stats":
        return [
          createPath(
            "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z"
          ),
          createPath(
            "M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Z"
          ),
          createPath(
            "M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          )
        ];
      case "friends":
        return [
          createPath("M15.182 15.182a4.5 4.5 0 0 1-6.364 0"),
          createPath("M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),
          createPath(
            "M9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Z"
          ),
          createPath(
            "M14.625 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
          )
        ];
      case "settings":
        return [
          createPath(
            "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          ),
          createPath("M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z")
        ];
      case "logout":
        return [
          createPath(
            "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
          ),
          createPath("M12 9l-3 3m0 0 3 3m-3-3h12.75")
        ];
      default:
        return [];
    }
  }
}
