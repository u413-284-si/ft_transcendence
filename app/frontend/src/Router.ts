import { authAndDecode } from "./services/authServices.js";
import AbstractView from "./views/AbstractView.js";

type RouteGuardResult = true | false | string;
type RouteGuard = () => RouteGuardResult | Promise<RouteGuardResult>;

interface RouteConfig {
  path: string;
  view: new () => AbstractView;
  guard?: RouteGuard;
}

export class Router {
  private routes: Map<string, RouteConfig> = new Map();
  private rootElement: HTMLElement;
  private currentView: AbstractView | null = null;
  private subviews: AbstractView[] = [];
  private currentPath: string = window.location.pathname;
  private routeChangeListeners: ((path: string) => void)[] = [];

  constructor(rootElementId: string) {
    this.rootElement = document.getElementById(rootElementId)!;
  }

  addRoute(config: RouteConfig): this {
    this.routes.set(config.path, config);
    return this;
  }

  start(): void {
    window.addEventListener("popstate", this.handlePopState);
    document.body.addEventListener("click", this.handleLinkClick);
    this.navigate(window.location.pathname, false);
  }

  async navigate(path: string, push: boolean = true): Promise<void> {
    if (!(await this.canNavigate())) return;

    const route = this.routes.get(path);
    if (!route) {
      console.warn(`No route found for path: ${path}`);
      return;
    }

    if (push && path !== this.currentPath) {
      history.pushState({}, "", path);
    }

    this.handleRouteChange(route, path);
  }

  private async handleRouteChange(route: RouteConfig, path: string) {
    // Guard check
    if (route.guard) {
      const guardResult = await route.guard();
      if (guardResult === true) {
        // continue
      } else if (guardResult === false) {
        console.warn("Route blocked by guard.");
        return;
      } else if (typeof guardResult === "string") {
        console.warn(`Redirecting due to guard → ${guardResult}`);
        this.navigate(guardResult);
        return;
      }
    }
    this.currentPath = path;

    // Cleanup current view
    this.currentView?.unmount?.();
    this.subviews.forEach((subview) => subview.unmount?.());
    this.subviews = [];

    // Instantiate and mount new view
    this.currentView = new route.view();
    await this.currentView.render();

    this.routeChangeListeners.forEach((fn) => fn(path));
  }

  registerSubview(view: AbstractView) {
    this.subviews.push(view);
  }

  unregisterSubview(view: AbstractView) {
    this.subviews = this.subviews.filter((v) => v !== view);
  }

  addRouteChangeListener(fn: (path: string) => void) {
    this.routeChangeListeners.push(fn);
  }

  removeRouteChangeListener(fn: (path: string) => void) {
    this.routeChangeListeners = this.routeChangeListeners.filter(
      (f) => f !== fn
    );
  }

  private handlePopState = () => {
    this.navigate(window.location.pathname, false);
  };

  private handleLinkClick = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest("a[data-link]");
    if (
      target instanceof HTMLAnchorElement &&
      target.href.startsWith(window.location.origin)
    ) {
      event.preventDefault();
      const url = new URL(target.href);
      this.navigate(url.pathname);
    }
  };

  private async canNavigate(): Promise<boolean> {
    const guards = [
      this.currentView?.getLeaveGuard?.(),
      ...this.subviews.map((v) => v.getLeaveGuard?.()).filter(Boolean)
    ];

    for (const guard of guards) {
      const result = guard?.();
      if (typeof result === "string") {
        if (!confirm(result)) return false;
      } else if (result === false) {
        return false;
      }
    }

    return true;
  }
}

export const authGuard = async (): Promise<RouteGuardResult> => {
  try {
    await authAndDecode();
    console.log("Authorized user");
    return true;
  } catch (err) {
    console.error("Authorization failed:", err);
    return "/login";
  }
};
