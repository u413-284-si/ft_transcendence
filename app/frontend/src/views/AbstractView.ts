import { sanitizeHTML } from "../sanitize.js";

export default abstract class AbstractView {
  constructor() {}

  setTitle(title: string) {
    document.title = title;
  }

  createNavbar() {
    return `<nav class="bg-blue-800 text-white py-4 shadow-lg">
					<div class="container mx-auto flex justify-center space-x-8">
						<a href="/home" class="text-lg hover:text-blue-300" data-link>Home</a>
						<a href="/newGame" class="text-lg hover:text-blue-300" data-link>New Game</a>
						<a href="/newTournament" class="text-lg hover:text-blue-300" data-link>New Tournament</a>
						<a href="/stats" class="text-lg hover:text-blue-300" data-link>Stats</a>
						<a href="/settings" class="text-lg hover:text-blue-300" data-link>Settings</a>
					</div>
			</nav>`;
  }

  createFooter() {
    return `<footer class="bg-blue-800 text-white py-4 text-center">
					<p class="text-sm">Pong Game &copy; 2025</p>
				</footer>`;
  }

  abstract createHTML(): string;

  updateHTML() {
    const html = this.createHTML();
    const cleanHTML = sanitizeHTML(html);
    document.querySelector("#app-content")!.innerHTML = cleanHTML;
  }

  async render() {}

  protected addListeners?(): void;

  unmount?(): void;

  abstract getName(): string;
}
