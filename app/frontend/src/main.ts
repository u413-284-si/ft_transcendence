import Login from "./views/LoginView.js";
import Register from "./views/RegisterView.js";
import Home from "./views/HomeView.js";
import NewGame from "./views/NewGameView.js";
import NewTournament from "./views/NewTournamentView.js";
import Settings from "./views/SettingsView.js";
import Stats from "./views/StatsView.js";
import Friends from "./views/FriendsView.js";
import { router } from "./routing/Router.js";
import { authGuard, guestOnlyGuard } from "./routing/routeGuard.js";
import { auth } from "./AuthManager.js";
import { logRouteChange, updateUI } from "./routing/routeChangeListener.js";

router
  .addRoute("/login", { view: Login, guard: guestOnlyGuard, layout: "guest" })
  .addRoute("/register", {
    view: Register,
    guard: guestOnlyGuard,
    layout: "guest"
  })
  .addRoute("/home", { view: Home, guard: authGuard, layout: "auth" })
  .addRoute("/newGame", { view: NewGame, guard: authGuard, layout: "auth" })
  .addRoute("/newTournament", {
    view: NewTournament,
    guard: authGuard,
    layout: "auth"
  })
  .addRoute("/settings", { view: Settings, guard: authGuard, layout: "auth" })
  .addRoute("/stats/:username", {
    view: Stats,
    guard: authGuard,
    layout: "auth",
    regex: "[a-zA-Z0-9-!?_$.]{3,20}"
  })
  .addRoute("/friends", { view: Friends, guard: authGuard, layout: "auth" })
  .addRouteChangeListener(logRouteChange)
  .addRouteChangeListener(updateUI);

document.addEventListener("DOMContentLoaded", () => {
  auth.initialize().then(() => {
    router.start();
    auth.onChange(async (isAuth) => {
      const path = window.location.pathname;
      if (!isAuth && path !== "/login") {
        console.log("Redirecting to login");
        await router.navigate("/login", false);
      }
    });
  });
});
