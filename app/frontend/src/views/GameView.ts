import AbstractView from "./AbstractView.js";
import { startGame, getGameState, setGameState } from "../game.js";
import { GameData } from "../types/GameData.js";
import { router } from "../Router.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import { setTournamentFinished } from "../services/tournamentService.js";
import ResultsView from "./ResultsView.js";

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

  constructor(private gameData: GameData) {
    super();
    this.setTitle("Now playing");
  }

  async createHTML() {
    const navbarHTML = await this.createNavbar();
    const footerHTML = await this.createFooter();
    return /* HTML */ `
      ${navbarHTML}
      <canvas
        id="gameCanvas"
        width="800"
        height="400"
        class="border-4 border-white"
      ></canvas>
      ${footerHTML}
    `;
  }

  async render() {
    await this.updateHTML();
    this.addEventListeners(this.controller.signal);
    await startGame(this.gameData, this.keys);
    if (getGameState() !== "aborted") {
      await this.navigateAfterGame();
    }
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

  unmount(): void {
    console.log("Cleaning up GameView");
    this.controller.abort();
  }

  async navigateAfterGame(): Promise<void> {
    try {
      if (this.gameData.type == GameType.single) {
        await router.navigate("/newGame", false);
      } else if (this.gameData.type == GameType.tournament) {
        if (this.gameData.tournament) {
          if (this.gameData.tournament.getNextMatchToPlay()) {
            const view = new MatchAnnouncement(this.gameData.tournament);
            router.navigateInternally(view);
            return;
          }
          await setTournamentFinished(this.gameData.tournament.getId());
          const view = new ResultsView(this.gameData.tournament);
          router.navigateInternally(view);
        }
      }
    } catch (error) {
      console.error("Error in navigateAfterGame(): ", error);
      // show error page
    }
  }

  async confirmLeave(): Promise<boolean> {
    if (getGameState() !== "running") return true;

    const confirmed = confirm("A game is running. Do you want to abort?");
    if (confirmed) {
      setGameState("aborted");
    }
    return confirmed;
  }

  getName(): string {
    return "game";
  }
}
