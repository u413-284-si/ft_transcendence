import Login from "./views/Login.js";
import Home from "./views/Home.js";
import NewGame from "./views/NewGame.js";
import NewTournament from "./views/NewTournament.js";
import Settings from "./views/Settings.js";
import Stats from "./views/Stats.js";
import { authAndDecode } from "./services/authServices.js";
import { Token } from "./types/Token.js";

export let globalToken: Token | null; // FIXME: should be in router

export const navigateTo = (url: string) => {
  history.pushState(null, "", url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/login", view: Login },
    { path: "/home", view: Home },
    { path: "/newGame", view: NewGame },
    { path: "/newTournament", view: NewTournament },
    { path: "/settings", view: Settings },
    { path: "/stats", view: Stats }
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path
    };
  });

  let match = potentialMatches.find((match) => match.isMatch);
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true
    };
    window.location.href = routes[0].path;
  }

  if (match.route.path === "/login" && globalToken !== null) {
    try {
      const token = await authAndDecode();
      console.log({ message: "Set global token", token });
      globalToken = token;
      navigateTo("/home");
    } catch (err) {
      console.error("Authorization failed:", err);
      globalToken = null;
      navigateTo("/login");
      return;
    }
  }

  if (match.route.path !== "/login") {
    try {
      const token = await authAndDecode();
      console.log({ message: "Set global token", token });
      globalToken = token;
    } catch (err) {
      console.error("Authorization failed:", err);
      globalToken = null;
      navigateTo("/login");
      return;
    }
  }

  const view = new match.route.view();
  await view.render();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLAnchorElement | null;
    if (!target) return;
    if (target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(target.href);
    }
  });
  router();
});
