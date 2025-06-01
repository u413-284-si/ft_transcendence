import AbstractView from "../views/AbstractView.js";
import {
  RouteConfig,
  RouteChangeListener,
  RouteChangeInfo,
  routeEvent
} from "../types/Route.js";
import ErrorView from "../views/ErrorView.js";
import { Layout } from "../Layout.js";
import { stopOnlineStatusTracking } from "../services/onlineStatusServices.js";

export class Router {
  private static instance: Router;
  private routes: Map<string, RouteConfig> = new Map();
  private currentView: AbstractView | null = null;
  private currentPath: string = "";
  private previousPath: string = "";
  private routeChangeListeners: RouteChangeListener[] = [];
  private layout = new Layout("guest");

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
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    document.body.addEventListener("click", this.handleLinkClick);
    await this.navigate(window.location.pathname, false);
  }

  async navigate(path: string, push: boolean = true): Promise<void> {
    try {
      path = this.normalizePath(path);
      if (this.currentPath === path && push) {
        console.log(`Already on path ${path}`);
        return;
      }

      console.log(`Try to navigate to ${path} from ${this.currentPath}`);

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
        history.pushState({}, "", path);
      } else {
        console.log(`Replace state for ${path}`);
        history.replaceState({}, "", path);
      }
      this.previousPath = this.currentPath;
      this.currentPath = path;

      this.layout.update(route.layout);

      const view = new route.view();
      await this.setView(view);

      this.notifyRouteChange("nav");
    } catch (error) {
      this.handleError("Error in navigate()", error);
    }
  }

  async switchView(view: AbstractView): Promise<void> {
    try {
      console.log(
        `Try to switch view from ${this.currentView?.getName()} to ${view.getName()}`
      );
      await this.setView(view);
      this.notifyRouteChange("view");
    } catch (error) {
      this.handleError("Error in switchView()", error);
    }
  }

  async reload() {
    await this.navigate(this.currentPath, false);
  }

  async handleError(message: string, error: unknown) {
    console.error(message, error);
    const view = new ErrorView(error);
    await this.setView(view);
  }

  addRouteChangeListener(listener: RouteChangeListener): this {
    this.routeChangeListeners.push(listener);
    return this;
  }

  removeRouteChangeListener(listener: RouteChangeListener): this {
    this.routeChangeListeners = this.routeChangeListeners.filter(
      (f) => f !== listener
    );
    return this;
  }

  private notifyRouteChange(event: routeEvent) {
    const info: RouteChangeInfo = {
      event: event,
      from: this.previousPath,
      to: this.currentPath,
      view: this.currentView
    };
    this.routeChangeListeners.forEach((listener) => listener(info));
  }

  private handlePopState = async () => {
    const targetPath = window.location.pathname;
    console.log(`Popstate triggered: ${targetPath}`);
    this.navigate(targetPath, false);
  };

  private handleLinkClick = (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest("a[data-link]");
    if (
      target instanceof HTMLAnchorElement &&
      target.href.startsWith(window.location.origin)
    ) {
      event.preventDefault();
      const url = new URL(target.href);
      this.navigate(url.pathname, true);
    }
  };

  private handleBeforeUnload = () => {
    console.log(`BeforeUnload triggered`);
    stopOnlineStatusTracking();
  };

  private async evaluateGuard(route: RouteConfig): Promise<boolean> {
    if (!route.guard) return true;

    try {
      const result = route.guard();
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
