import AbstractView from "./views/AbstractView.js";

export type RouteGuardResult = true | false | string;
type RouteGuard = () => RouteGuardResult | Promise<RouteGuardResult>;

type RouteConfig = {
  view: new () => AbstractView;
  guard?: RouteGuard;
};

export class Router {
  private static instance: Router;
  private routes: Map<string, RouteConfig> = new Map();
  // private rootElement: HTMLElement;
  private currentView: AbstractView | null = null;
  private subviews: AbstractView[] = [];
  private currentPath: string = "";
  private routeChangeListeners: ((path: string) => void)[] = [];

  private constructor() {}

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  addRoute(path: string, config: RouteConfig): this {
    this.routes.set(path, config);
    return this;
  }

  start(): void {
    window.addEventListener("popstate", this.handlePopState);
    document.body.addEventListener("click", this.handleLinkClick);
    this.navigate(window.location.pathname, false);
  }

  async navigate(path: string, push: boolean = true): Promise<void> {
    try {
      if (this.currentPath === path) {
        console.log(`Already on path ${path}`);
        return;
      }

      console.log(`Try to navigate to ${path} from ${this.currentPath}`);
      if (!(await this.canNavigateFrom())) {
        console.warn(`Navigation blocked`);
        return;
      }

      const route = this.routes.get(path);
      if (!route) {
        console.warn(`No route found for path: ${path}. Navigate to /home`);
        await this.navigate("/home", false);
        return;
      }

      await this.handleRouteChange(route, path, push);
    } catch (error) {
      console.error("Error during navigation:", error);
    }
  }

  private async handleRouteChange(
    route: RouteConfig,
    path: string,
    push: boolean
  ) {
    const isAllowed = await this.evaluateGuard(route);
    if (!isAllowed) return;

    if (push) {
      console.log(`Push state for ${path}`);
      history.pushState({}, "", path);
    } else {
      console.log(`Replace state for ${path}`);
      history.replaceState({}, "", path);
    }
    this.currentPath = path;

    this.clearCurrentView();

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
    console.log("Popstate event triggered");
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

  private async canNavigateFrom(): Promise<boolean> {
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

  private async evaluateGuard(route: RouteConfig): Promise<boolean> {
    if (!route.guard) return true;

    try {
      const result = await route.guard();
      console.log(`Route guard result: ${result}`);

      if (result === false) {
        console.warn("Route blocked by guard.");
        return false;
      }

      if (typeof result === "string") {
        console.warn(`Redirecting due to guard → ${result}`);
        await this.navigate(result, false);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error during guard evaluation:", error);
      return false;
    }
  }

  private clearCurrentView() {
    this.currentView?.unmount?.();
    this.subviews.forEach((s) => s.unmount?.());
    this.subviews = [];
  }
}

export const router = Router.getInstance();
