import AbstractView from "./AbstractView.js";
import { startGame } from "../game.js";
import { Tournament } from "../Tournament.js";

export type GameKey = "w" | "s" | "ArrowUp" | "ArrowDown";

export enum GameType {
  single,
  tournament
}

export class GameView extends AbstractView {
  private keys: Record<GameKey, boolean> = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
  };
  private controller = new AbortController();

  constructor(
    private player1: string,
    private player2: string,
    private activeUserRole: string | null,
    private type: GameType,
    private tournament: Tournament | null
  ) {
    super();
    this.setTitle("Now playing");
  }

  async createHTML() {
    return `
      <canvas id="gameCanvas" width="800" height="400" class="border-4 border-white"></canvas>
      `;
  }

  async render() {
    await this.updateHTML();
    this.addEventListeners(this.controller.signal);
    await startGame(
      this.player1,
      this.player2,
      this.activeUserRole,
      this.type,
      this.keys,
      this.controller,
      this.tournament
    );
  }

  private addEventListeners(signal: AbortSignal) {
    document.addEventListener("keydown", this.onKeyDown, { signal: signal });
    document.addEventListener("keyup", this.onKeyUp, { signal: signal });
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key as GameKey;
    if (key in this.keys) {
      this.keys[key] = true;
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const key = event.key as GameKey;
    if (key in this.keys) {
      this.keys[key] = false;
    }
  };
}
