export type LayoutMode = "auth" | "guest";

export class Layout {
  private mode: LayoutMode;

  constructor(initialMode: LayoutMode) {
    this.mode = initialMode;
  }

  getMode(): LayoutMode {
    return this.mode;
  }

  setMode(newMode: LayoutMode): void {
    this.mode = newMode;
  }

  renderShell(): string {
    return `
      <header class="bg-blue-800 text-white py-4 shadow-lg">${this.renderHeader()}</header>
      <main id="app-content"></main>
      <footer class="bg-blue-800 text-white py-4 text-center>${this.renderFooter()}</footer>
    `;
  }

  private renderHeader(): string {
    if (this.mode === "auth") {
      return /* HTML */ `<nav>
        <div class="container mx-auto flex justify-center space-x-8">
          <a href="/home" class="text-lg hover:text-blue-300" data-link>Home</a>
          <a href="/newGame" class="text-lg hover:text-blue-300" data-link
            >New Game</a
          >
          <a href="/newTournament" class="text-lg hover:text-blue-300" data-link
            >New Tournament</a
          >
          <a href="/stats" class="text-lg hover:text-blue-300" data-link
            >Stats</a
          >
          <a href="/settings" class="text-lg hover:text-blue-300" data-link
            >Settings</a
          >
        </div>
      </nav>`;
    }
    return /* HTML */ `<nav class="bg-blue-800 text-white py-4 shadow-lg">
      <div class="container mx-auto flex justify-center space-x-8">
        <a href="/login" class="text-lg hover:text-blue-300" data-link>Login</a>
        <a href="/register" class="text-lg hover:text-blue-300" data-link
          >Register</a
        >
      </div>
    </nav>`;
  }

  private renderFooter(): string {
    return /* HTML */ `<p class="text-sm">Pong Game &copy; 2025</p>`;
  }
}
