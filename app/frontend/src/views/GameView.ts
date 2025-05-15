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
    private type: GameType,
    private tournament: Tournament | null
  ) {
    super();
    this.setTitle("Now playing");
  }

  createHTML() {
    return `
      <canvas id="gameCanvas" width="800" height="400" class="border-4 border-white"></canvas>
      `;
  }

  async render() {
    this.updateHTML();
    this.addListeners();
    await startGame(
      this.player1,
      this.player2,
      this.type,
      this.keys,
      this.controller,
      this.tournament
    );
  }

  protected addListeners() {
    document.addEventListener("keydown", this.onKeyDown, {
      signal: this.controller.signal
    });
    document.addEventListener("keyup", this.onKeyUp, {
      signal: this.controller.signal
    });
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
