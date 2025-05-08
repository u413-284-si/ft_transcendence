export default abstract class {
  constructor() {}

  setTitle(title: string) {
    document.title = title;
  }

  async createNavbar() {
    return `<nav class="bg-blue-800 text-white py-4 shadow-lg">
					<div class="container mx-auto flex justify-center space-x-8">
						<a href="/home" class="hover:text-indigo-600" data-link>Home</a>
						<a href="/newGame" class="hover:text-indigo-600" data-link>New Game</a>
						<a href="/newTournament" class="hover:text-indigo-600" data-link>New Tournament</a>
						<a href="/stats" class="hover:text-indigo-600" data-link>Stats</a>
						<a href="/settings" class="hover:text-indigo-600" data-link>Settings</a>
					</div>
			</nav>`;
  }

  async createFooter() {
    return `<footer class="bg-blue-800 text-white py-4 text-center">
					<p class="text-sm">Pong Game &copy; 2025</p>
				</footer>`;
  }

  async createHTML() {
    return "";
  }

  async updateHTML() {
    document.querySelector("#app")!.innerHTML = await this.createHTML();
  }

  async render() {}

  unmount?(): void;

  async confirmLeave?(): Promise<boolean>;

  confirmLeaveSync?(): boolean;

  abstract getName(): string;
}
