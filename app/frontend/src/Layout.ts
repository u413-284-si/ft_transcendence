export type LayoutMode = "auth" | "guest";

export class Layout {
  private mode: LayoutMode;
  private rootEl: HTMLElement;

  constructor(initialMode: LayoutMode) {
    this.mode = initialMode;
    this.rootEl = document.getElementById("app")!;
    this.renderShell();
  }

  public update(newMode: LayoutMode): void {
    if (this.mode === newMode) return;
    this.mode = newMode;
    this.renderShell();
  }

  private renderShell(): void {
    this.rootEl.className =
      "bg-blue-900 text-white min-h-screen min-w-screen flex flex-col";
    this.rootEl.innerHTML = this.getShellHTML();
  }

  private getShellHTML(): string {
    return `
      <header class="bg-blue-800 text-white py-4 shadow-lg">${this.getHeaderHTML()}</header>
      <main id="app-content" class="flex-grow"></main>
      <footer class="bg-blue-800 text-white py-4 shadow-lg">${this.getFooterHTML()}</footer>
    `;
  }

  private getHeaderHTML(): string {
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
    return /* HTML */ `<nav>
      <div class="container mx-auto flex justify-center space-x-8">
        <a href="/login" class="text-lg hover:text-blue-300" data-link>Login</a>
        <a href="/register" class="text-lg hover:text-blue-300" data-link
          >Register</a
        >
      </div>
    </nav>`;
  }

  private getFooterHTML(): string {
    return /* HTML */ `<div
      class="container mx-auto flex justify-center space-x-8"
    >
      <p class="text-sm">Pong Game &copy; 2025</p>
    </div>`;
  }
}
