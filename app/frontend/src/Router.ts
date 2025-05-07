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
  private currentView: AbstractView | null = null;
  private currentPath: string = "";
  private publicPath: string = "";
  private isInInternalView: boolean = false;
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

  async navigate(
    path: string,
    push: boolean = true,
    skipLeaveCheck: boolean = false
  ): Promise<void> {
    try {
      if (this.currentPath === path && !this.isInInternalView) {
        console.log(`Already on path ${path}`);
        return;
      }

      console.log(`Try to navigate to ${path} from ${this.currentPath}`);
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

      if (this.isInInternalView) {
        this.isInInternalView = false;
      }

      if (push) {
        console.log(`Push state for ${path}`);
        history.pushState({}, "", path);
      } else {
        console.log(`Replace state for ${path}`);
        history.replaceState({}, "", path);
      }
      this.currentPath = path;
      this.publicPath = path;

      const view = new route.view();
      this.setView(view);

      this.routeChangeListeners.forEach((fn) => fn(path));
    } catch (error) {
      console.error("Error during navigate():", error);
    }
  }

  async navigateInternally(view: AbstractView): Promise<void> {
    try {
      const target = `/internal/${view.getName()}`;
      console.log(`Internally navigate from ${this.currentPath} to ${target}`);
      if (!(await this.canNavigateFrom())) {
        console.warn(`Navigation blocked`);
        return;
      }
      if (!this.isInInternalView) {
        this.isInInternalView = true;
      }
      this.currentPath = target;
      await this.setView(view);
    } catch (error) {
      console.error("Error during navigateInternally():", error);
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

  private handlePopState = async () => {
    const targetPath = window.location.pathname;
    console.log("Popstate event triggered. Target:", targetPath);

    if (!(await this.canNavigateFrom())) {
      history.pushState({}, "", this.currentPath);
      return;
    }

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
}

export const router = Router.getInstance();
