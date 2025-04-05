import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Now playing");
  }

  private keyStates: Record<string, boolean> = {};
  private controller = new AbortController();

  async createHTML() {
    return `
      <canvas id="gameCanvas" width="800" height="400" class="border-4 border-white"></canvas>
      `;
  }

  async render() {
    await this.updateHTML();
  }

  private addEventListeners() {
    window.addEventListener("keydown", this.keyDownHandler, {signal: this.controller.signal});
    window.addEventListener("keyup", this.keyUpHandler, {signal: this.controller.signal});
  }

  public cleanup() {
    this.controller.abort();
    console.log("Event listeners removed");
  }

      // Event handler for key press
      private keyDownHandler = (event: KeyboardEvent) => {
        this.keyStates[event.key] = true;
        console.log(`Key Down: ${event.key}`, this.keyStates);
    };

    // Event handler for key release
    private keyUpHandler = (event: KeyboardEvent) => {
        this.keyStates[event.key] = false;
        console.log(`Key Up: ${event.key}`, this.keyStates);
    };

}
