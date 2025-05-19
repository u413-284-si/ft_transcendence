import AbstractView from "./AbstractView.js";
import { startGame, getIsAborted, setIsAborted } from "../game.js";
import { router } from "../Router.js";
import MatchAnnouncement from "./MatchAnnouncement.js";
import { setTournamentFinished } from "../services/tournamentService.js";
import ResultsView from "./ResultsView.js";
import NewGameView from "./NewGame.js";
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
    private nickname1: string,
    private nickname2: string,
    private gameType: GameType,
    private tournament: Tournament | null
  ) {
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
    this.handleGame();
  }

  private addEventListeners(signal: AbortSignal) {
    document.addEventListener("keydown", this.onKeyDown, { signal: signal });
    document.addEventListener("keyup", this.onKeyUp, { signal: signal });
  }

  private isGameRunning(): boolean {
    return !getIsAborted();
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

  async handleGame(): Promise<void> {
    try {
      await startGame(
        this.nickname1,
        this.nickname2,
        this.gameType,
        this.tournament,
        this.keys
      );
      if (getIsAborted()) return;

      if (this.gameType == GameType.single) {
        const view = new NewGameView();
        await router.switchView(view);
      } else if (this.gameType == GameType.tournament) {
        if (this.tournament) {
          if (this.tournament.getNextMatchToPlay()) {
            const view = new MatchAnnouncement(this.tournament);
            router.switchView(view);
            return;
          }
          await setTournamentFinished(this.tournament.getId());
          const view = new ResultsView(this.tournament);
          router.switchView(view);
        }
      }
    } catch (error) {
      console.error("Error in navigateAfterGame(): ", error);
      // FIXME: show error page
    }
  }

  async confirmLeave(): Promise<boolean> {
    if (this.canLeave()) return true;

    const confirmed = confirm("A game is running. Do you want to abort?");
    if (confirmed) {
      setIsAborted(true);
    }
    return confirmed;
  }

  canLeave(): boolean {
    return !this.isGameRunning();
  }

  getName(): string {
    return "game";
  }
}
