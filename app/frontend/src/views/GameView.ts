import AbstractView from "./AbstractView.js";
import { startGame, getIsAborted, setIsAborted } from "../game.js";
import { router } from "../routing/Router.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import { setTournamentFinished } from "../services/tournamentService.js";
import ResultsView from "./ResultsView.js";
import NewGameView from "./NewGameView.js";
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

  createHTML() {
    const navbarHTML = this.createNavbar();
    const footerHTML = this.createFooter();
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
    this.updateHTML();
    this.addListeners();
    this.handleGame();
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

  unmount(): void {
    console.log("Cleaning up GameView");
    setIsAborted(true);
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

  getName(): string {
    return "game";
  }
}
