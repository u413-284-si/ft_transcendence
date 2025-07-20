import AbstractView from "../views/AbstractView.js";
import {
  RouteConfig,
  RouteChangeListener,
  RouteChangeInfo,
  routeEvent,
  RouteEntry,
  RouteGuard
} from "../types/Route.js";
import ErrorView from "../views/ErrorView.js";
import { closeSSEConnection } from "../services/serverSentEventsServices.js";
import { ApiError } from "../services/api.js";

export class Router {
  private static instance: Router;
  private routes: RouteEntry[] = [];
  private currentView: AbstractView | null = null;
  private currentPath: string = "";
  private currentParams: Record<string, string> = {};
  private previousPath: string = "";
  private routeChangeListeners: RouteChangeListener[] = [];

  private constructor() {}

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  addRoute(path: string, config: RouteConfig): this {
    let regex: RegExp;
    let dynamicParam: string | undefined;

    if (path.includes(":")) {
      // Must be dynamic.
      // Only allow one dynamic param at the end.
      const match = path.match(/^(.*)\/:([a-zA-Z0-9_]+)$/);
      if (!match) {
        throw new Error(`Invalid dynamic route pattern: ${path}`);
      }

      const staticPart = match[1];
      dynamicParam = match[2];

      const paramRegex = config.regex ?? "[^/]+";
      regex = new RegExp(`^${staticPart}/(${paramRegex})$`);
    } else {
      // Static: match exactly.
      regex = new RegExp(`^${path}$`);
    }

    this.routes.push({
      path,
      regex,
      dynamicParam,
      config
    });

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

      const route = this.routes.find((r) => r.regex.test(path));
      if (!route) {
        console.warn(`No route found for path: ${path}. Navigate to /home`);
        await this.navigate("/home", false);
        return;
      }

      if (route.config.guard) {
        const isAllowed = await this.evaluateGuard(route.config.guard);
        if (!isAllowed) return;
      }

      this.currentParams = {};
      if (route.dynamicParam) {
        const match = path.match(route.regex)!;
        this.currentParams[route.dynamicParam] = match[1];
      }

      if (push) {
        console.log(`Push state for ${path}`);
        history.pushState({}, "", path);
      } else {
        console.log(`Replace state for ${path}`);
        history.replaceState({}, "", path);
      }
      this.previousPath = this.currentPath;
      this.currentPath = path;

      const view = new route.config.view();
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
    if (error instanceof ApiError && error.status === 401) {
      return;
    }
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
    closeSSEConnection();
  };

  private async evaluateGuard(guard: RouteGuard): Promise<boolean> {
    try {
      const result = guard();
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

  getParams(): Record<string, string> {
    return this.currentParams;
  }
}

export const router = Router.getInstance();
