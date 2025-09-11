import { routerLogger } from "../logging/config.js";
import type { RouteChangeListener } from "../types/Route";
import { getAllBySelector } from "../utility.js";

export const logRouteChange: RouteChangeListener = (info) => {
  if (info.event === "nav") {
    routerLogger.debug("RouteChange: Navigation");
    routerLogger.debug("From:", info.from);
    routerLogger.debug("To:", info.to);
  } else if (info.event === "view") {
    routerLogger.debug("RouteChange: Switch view");
    routerLogger.debug("View:", info.view?.getName());
  }
};

export const updateUI: RouteChangeListener = (info) => {
  const navItems = getAllBySelector<HTMLAnchorElement>("[data-link]");
  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === info.to) {
      item.classList.add("active-link");
    } else {
      item.classList.remove("active-link");
    }
  });
};
