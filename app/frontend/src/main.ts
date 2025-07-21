import Login from "./views/LoginView.js";
import Register from "./views/RegisterView.js";
import Home from "./views/HomeView.js";
import NewGame from "./views/NewGameView.js";
import NewTournament from "./views/NewTournamentView.js";
import Profile from "./views/ProfileView.js";
import Settings from "./views/SettingsView.js";
import Stats from "./views/StatsView.js";
import Friends from "./views/FriendsView.js";
import { router } from "./routing/Router.js";
import { authGuard, guestOnlyGuard } from "./routing/routeGuard.js";
import { auth } from "./AuthManager.js";
import { logRouteChange, updateUI } from "./routing/routeChangeListener.js";
import { layout } from "./Layout.js";

router
  .addRoute("/login", { view: Login, guard: guestOnlyGuard })
  .addRoute("/register", {
    view: Register,
    guard: guestOnlyGuard
  })
  .addRoute("/home", { view: Home, guard: authGuard })
  .addRoute("/newGame", { view: NewGame, guard: authGuard })
  .addRoute("/newTournament", {
    view: NewTournament,
    guard: authGuard
  })
  .addRoute("/profile", { view: Profile, guard: authGuard })
  .addRoute("/settings", { view: Settings, guard: authGuard })
  .addRoute("/stats/:username", {
    view: Stats,
    guard: authGuard,
    regex: "[a-zA-Z0-9-!?_$.]{3,20}"
  })
  .addRoute("/friends", { view: Friends, guard: authGuard })
  .addRouteChangeListener(logRouteChange)
  .addRouteChangeListener(updateUI);

document.addEventListener("DOMContentLoaded", async () => {
  const [frRes, enRes, deRes, piRes, trRes] = await Promise.all([
    fetch("/locales/fr.json"),
    fetch("/locales/en.json"),
    fetch("/locales/de.json"),
    fetch("/locales/pi.json"),
    fetch("/locales/tr.json")
  ]);

  if (!frRes.ok || !enRes.ok || !deRes.ok || !piRes.ok || !trRes.ok) {
    console.error("Failed to load one or more translation files");
    return;
  }

  const [fr, en, de, pi, tr] = await Promise.all([
    frRes.json(),
    enRes.json(),
    deRes.json(),
    piRes.json(),
    trRes.json()
  ]);

  const preferredLang = localStorage.getItem("preferredLanguage") as
    | "en"
    | "fr"
    | "de"
    | "pi"
    | "tr"
    | null;

  await i18next.init({
    lng: preferredLang || "en",
    fallbackLng: "fr",
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
      pi: { translation: pi },
      tr: { translation: tr }
    },
    interpolation: { escapeValue: false },
    keySeparator: "."
  });

  auth.onChange(async (isAuth) => {
    console.info("Layout listener initialized.");
    if (isAuth) layout.update("auth");
    else layout.update("guest");
    router.reload();
  });

  router.start();
  auth.initialize().then(() => {
    auth.onChange(async (isAuth) => {
      const path = window.location.pathname;
      if (!isAuth && path !== "/login") {
        console.log("Redirecting to login");
        await router.navigate("/login", false);
      }
    });
  });
});
