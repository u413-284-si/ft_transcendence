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
  .addRoute({ path: "/login", view: Login, guard: guestOnlyGuard })
  .addRoute({ path: "/home", view: Home, guard: authGuard })
  .addRoute({ path: "/newGame", view: NewGame, guard: authGuard })
  .addRoute({ path: "/newTournament", view: NewTournament, guard: authGuard })
  .addRoute({ path: "/settings", view: Settings, guard: authGuard })
  .addRoute({ path: "/stats", view: Stats, guard: authGuard });

auth.onChange((isAuth) => {
  const path = window.location.pathname;
  if (!isAuth && path !== "/login") {
    router.navigate("/login", false);
  } else if (isAuth && path === "/login") {
    router.navigate("/home", false);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  auth.initialize().then(() => {
    router.start();
  });
});
