import Login from "./views/LoginView.js";
import Home from "./views/HomeView.js";
import NewGame from "./views/NewGameView.js";
import NewTournament from "./views/NewTournamentView.js";
import Settings from "./views/SettingsView.js";
import Stats from "./views/StatsView.js";
import { router } from "./routing/Router.js";
import { authGuard, guestOnlyGuard } from "./routing/routeGuard.js";
import { auth } from "./AuthManager.js";
import { logRouteChange, updateUI } from "./routing/routeChangeListener.js";

router
  .addRoute("/login", { view: Login, guard: guestOnlyGuard })
  .addRoute("/home", { view: Home, guard: authGuard })
  .addRoute("/newGame", { view: NewGame, guard: authGuard })
  .addRoute("/newTournament", { view: NewTournament, guard: authGuard })
  .addRoute("/settings", { view: Settings, guard: authGuard })
  .addRoute("/stats", { view: Stats, guard: authGuard })
  .addRouteChangeListener(logRouteChange)
  .addRouteChangeListener(updateUI);

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
