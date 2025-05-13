import { RouteChangeInfo } from "./Router";

export const logRouteChange = (info: RouteChangeInfo) => {
  console.log("From:", info.from);
  console.log("To:", info.to);
  console.log("View:", info.view?.getName());
};

export const updateUI = (info: RouteChangeInfo) => {
  const navItems = document.querySelectorAll("[data-link]");
  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === info.to) {
      item.classList.add("text-indigo-600", "font-semibold", "underline");
    } else {
      item.classList.remove("text-indigo-600", "font-semibold", "underline");
    }
  });
};
