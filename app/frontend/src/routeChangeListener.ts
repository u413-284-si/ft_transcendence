import { RouteChangeListener } from "./Router";

export const logRouteChange: RouteChangeListener = (info) => {
  if (info.event === "nav") {
    console.log("RouteChange: Navigation");
    console.log("From:", info.from);
    console.log("To:", info.to);
  } else if (info.event === "view") {
    console.log("RouteChange: Switch view");
    console.log("View:", info.view?.getName());
  }
};

export const updateUI: RouteChangeListener = (info) => {
  const navItems = document.querySelectorAll("[data-link]");
  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === info.to) {
      item.classList.add("text-blue-300", "font-semibold", "underline");
    } else {
      item.classList.remove("text-blue-300", "font-semibold", "underline");
    }
  });
};
