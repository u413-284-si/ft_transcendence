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

  async start(): Promise<void> {
    window.addEventListener("popstate", this.handlePopState);
    document.body.addEventListener("click", this.handleLinkClick);
    await this.navigate(window.location.pathname, false);
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

      const isAllowed = await this.evaluateGuard(route);
      if (!isAllowed) return;

      if (push && this.currentPath !== "/internal") {
        console.log(`Push state for ${path}`);
        history.pushState({}, "", path);
      } else {
        console.log(`Replace state for ${path}`);
        history.replaceState({}, "", path);
      }
      this.currentPath = path;

      const view = new route.view();
      this.setView(view);

      this.routeChangeListeners.forEach((fn) => fn(path));
    } catch (error) {
      console.error("Error during navigate():", error);
    }
  }

  async navigateToView(view: AbstractView): Promise<void> {
    try {
      console.log(`Try to navigate to /internal from ${this.currentPath}`);
      if (!(await this.canNavigateFrom())) {
        console.warn(`Navigation blocked`);
        return;
      }
      this.currentPath = "/internal";
      await this.setView(view);
    } catch (error) {
      console.error("Error during navigateToView():", error);
    }
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
    if (this.currentView?.confirmLeave) {
      const result = await this.currentView.confirmLeave();
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
}

export const router = Router.getInstance();
