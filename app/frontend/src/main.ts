import Login from "./views/Login.js";
import Home from "./views/Home.js";
import NewGame from "./views/NewGame.js";
import NewTournament from "./views/NewTournament.js";
import Settings from "./views/Settings.js";
import Stats from "./views/Stats.js";
import { authGuard, Router } from "./Router.js";

const router = new Router("app");

router
  .addRoute({ path: "/login", view: Login })
  .addRoute({ path: "/home", view: Home, guard: authGuard })
  .addRoute({ path: "/newGame", view: NewGame, guard: authGuard })
  .addRoute({ path: "/newTournament", view: NewTournament, guard: authGuard })
  .addRoute({ path: "/settings", view: Settings, guard: authGuard })
  .addRoute({ path: "/stats", view: Stats, guard: authGuard });

document.addEventListener("DOMContentLoaded", () => {
  router.start();
});

export default router;
