import { GameState } from "./config.js";
import { setupInputListeners } from "./input.js";
import { startGame, update } from "./game.js";
import { draw } from "./draw.js";
import Home from "./views/Home.js";
import NewGame from "./views/NewGame.js";
import NewTournament from "./views/NewTournament.js";
import Settings from "./views/Settings.js";
import Stats from "./views/Stats.js";

const navigateTo = (url: string) => {
	history.pushState(null, "", url);
	router();
}

const router = async () => {
	const routes = [
		{ path: "/", view: Home },
		{ path: "/newGame", view: NewGame },
		{ path: "/newTournament", view: NewTournament },
		{ path: "/settings", view: Settings },
		{ path: "/stats", view: Stats },
	];

	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path
		};
	});

	let match = potentialMatches.find(match => match.isMatch);
	if (!match) {
		match = {
			route: routes[0],
			isMatch: true
		}
	}

	const view = new match.route.view();
	document.querySelector("#app")!.innerHTML = await view.getHTML();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", (e: MouseEvent) => {
		const target = e.target as HTMLAnchorElement | null;
		if (!target)
			return;
		if (target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(target.href);
		}
	})
	router();
});

// function gameLoop() {
// 	update();
// 	draw();
// 	requestAnimationFrame(gameLoop);
// }

// setupInputListeners();

// // Start game when Enter is pressed
// document.addEventListener("keydown", (event) => {
// 	if (!GameState.gameStarted && event.key === "Enter" && GameState.player1 && GameState.player2) {
// 		startGame();
// 	}
// });

// gameLoop();
