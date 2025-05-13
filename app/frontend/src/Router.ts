import AbstractView from "./views/AbstractView.js";

export type RouteGuardResult = true | false | string;
type RouteGuard = () => RouteGuardResult | Promise<RouteGuardResult>;

type RouteConfig = {
  view: new () => AbstractView;
  guard?: RouteGuard;
};

export type RouteChangeInfo = {
  from: string;
  to: string;
  view: AbstractView | null;
};
type RouteChangeListener = (info: RouteChangeInfo) => void;

export class Router {
  private static instance: Router;
  private routes: Map<string, RouteConfig> = new Map();
  private currentView: AbstractView | null = null;
  private currentPath: string = "";
  private previousPath: string = "";
  private routeChangeListeners: RouteChangeListener[] = [];
  private historyIndex: number = 0;
  private suppressNextPopstate: boolean = false;

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

  async start(): Promise<void> {
    history.replaceState(
      { index: this.historyIndex },
      "",
      window.location.pathname
    );

    window.addEventListener("popstate", this.handlePopState);
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    document.body.addEventListener("click", this.handleLinkClick);
    await this.navigate(window.location.pathname, false);
  }

  async navigate(
    path: string,
    push: boolean = true,
    skipLeaveCheck: boolean = false
  ): Promise<void> {
    try {
      path = this.normalizePath(path);
      if (this.currentPath === path) {
        console.log(`Already on path ${path}`);
        return;
      }

      console.log(
        `Try to navigate to ${path} from ${this.currentPath}, index: ${this.historyIndex}`
      );
      if (!skipLeaveCheck && !(await this.canNavigateFrom())) {
        console.warn(`Navigation blocked`);
        return;
      }

      const route = this.routes.get(path);
      if (!route) {
        console.warn(`No route found for path: ${path}. Navigate to /home`);
        await this.navigate("/home", false);
        return;
      }

      const isAllowed = await this.evaluateGuard(route);
      if (!isAllowed) return;

      if (push) {
        console.log(`Push state for ${path}`);
        this.historyIndex++;
        history.pushState({ index: this.historyIndex }, "", path);
      } else {
        console.log(`Replace state for ${path}`);
        history.replaceState({ index: this.historyIndex }, "", path);
      }
      this.previousPath = this.currentPath;
      this.currentPath = path;

      const view = new route.view();
      await this.setView(view);

      this.notifyRouteChange();
    } catch (error) {
      console.error("Error during navigate():", error);
    }
  }

  async switchView(view: AbstractView): Promise<void> {
    try {
      console.log(
        `Try to switch view from ${this.currentView?.getName()} to ${view.getName()}`
      );
      if (!(await this.canNavigateFrom())) {
        console.warn(`Switching blocked`);
        return;
      }
      await this.setView(view);
      this.notifyRouteChange();
    } catch (error) {
      console.error("Error during switchView():", error);
    }
  }

  addRouteChangeListener(fn: RouteChangeListener): this {
    this.routeChangeListeners.push(fn);
    return this;
  }

  removeRouteChangeListener(fn: RouteChangeListener): this {
    this.routeChangeListeners = this.routeChangeListeners.filter(
      (f) => f !== fn
    );
    return this;
  }

  private notifyRouteChange() {
    const info: RouteChangeInfo = {
      from: this.previousPath,
      to: this.currentPath,
      view: this.currentView
    };
    this.routeChangeListeners.forEach((fn) => fn(info));
  }

  private handlePopState = async (event: PopStateEvent) => {
    if (this.suppressNextPopstate) {
      console.log("Popstate suppressed");
      this.suppressNextPopstate = false;
      return;
    }
    const state = event.state as { index?: number } | null;
    const newIndex = state?.index ?? this.historyIndex;
    const delta = newIndex - this.historyIndex;

    const direction =
      delta > 0 ? "forward" : delta < 0 ? "backward" : "unknown";

    const targetPath = window.location.pathname;
    console.log(`Popstate triggered: ${direction} to ${targetPath}`);

    if (!(await this.canNavigateFrom())) {
      console.warn("Navigation blocked. Reverting...");
      this.suppressNextPopstate = true;
      // Restore the previous state
      history.go(-delta);
      return;
    }

    this.historyIndex = newIndex;
    this.navigate(window.location.pathname, false, true);
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

  private handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (this.currentView?.canLeave && !this.currentView?.canLeave()) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  private async canNavigateFrom(): Promise<boolean> {
    if (this.currentView?.confirmLeave) {
      const result = await this.currentView.confirmLeave();
      console.log(`Confirm leave result: ${result}`);
      return result;
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

  private async setView(view: AbstractView) {
    if (this.currentView) {
      this.currentView.unmount?.();
    }
    this.currentView = view;
    await view.render();
  }

  getCurrentView(): AbstractView | null {
    return this.currentView;
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  normalizePath(path: string): string {
    return path.replace(/\/+$/, "") || "/";
  }
}

export const router = Router.getInstance();
