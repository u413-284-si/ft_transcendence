import Login from "./views/Login.js";
import Home from "./views/Home.js";
import NewGame from "./views/NewGame.js";
import NewTournament from "./views/NewTournament.js";
import Settings from "./views/Settings.js";
import Stats from "./views/Stats.js";
import { router } from "./Router.js";
import { authGuard, guestOnlyGuard } from "./routeGuard.js";
import { auth } from "./AuthManager.js";

router
  .addRoute("/login", { view: Login, guard: guestOnlyGuard })
  .addRoute("/home", { view: Home, guard: authGuard })
  .addRoute("/newGame", { view: NewGame, guard: authGuard })
  .addRoute("/newTournament", { view: NewTournament, guard: authGuard })
  .addRoute("/settings", { view: Settings, guard: authGuard })
  .addRoute("/stats", { view: Stats, guard: authGuard })
  .addRouteChangeListener(({ from, to, view }) => {
    console.log("From:", from);
    console.log("To:", to);
    console.log("View:", view?.getName());

    // Update UI
    const navItems = document.querySelectorAll("[data-link]");
    navItems.forEach((item) => {
      const href = item.getAttribute("href");
      if (href === to) {
        item.classList.add("text-indigo-600", "font-semibold", "underline");
      } else {
        item.classList.remove("text-indigo-600", "font-semibold", "underline");
      }
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  auth.initialize().then(() => {
    router.start();
    auth.onChange(async (isAuth) => {
      const path = window.location.pathname;
      if (!isAuth && path !== "/login") {
        alert("User was logged out");
        await router.navigate("/login", false);
      }
    });
  });
});
