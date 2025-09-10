import AbstractView from "./AbstractView.js";
import { startGame, getIsAborted, setIsAborted } from "../game.js";
import { router } from "../routing/Router.js";
import MatchAnnouncement from "./MatchAnnouncementView.js";
import ResultsView from "./ResultsView.js";
import NewGameView from "./NewGameView.js";
import { Tournament } from "../Tournament.js";
import { PlayedAs, PlayerType } from "../types/IMatch.js";
import { getById } from "../utility.js";
import { toaster } from "../Toaster.js";
import { viewLogger } from "../logging/config.js";

export type GameKey = "w" | "s" | "ArrowUp" | "ArrowDown";

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
    private type1: PlayerType,
    private type2: PlayerType,
    private userRole: PlayedAs,
    private tournament: Tournament | null
  ) {
    super();
    this.setTitle();
  }

  override async mount(): Promise<void> {
    super.render();
    this.toggleLangSwitcher();
    this.handleGame();
  }

  createHTML() {
    return /* HTML */ `
      <canvas
        id="gameCanvas"
        width="1000"
        height="588"
        class="border-4 border-white animate-glow-border-white rounded-xl shadow-neon-cyan mt-10"
      ></canvas>
    `;
  }

  protected override addListeners() {
    document.addEventListener("keydown", this.onKeyDown, {
      signal: this.controller.signal
    });
    document.addEventListener("keyup", this.onKeyUp, {
      signal: this.controller.signal
    });
  }

  private isKeyAllowedForPlayer(key: GameKey): boolean {
    const keysPlayerOne: GameKey[] = ["w", "s"];
    const keysPlayerTwo: GameKey[] = ["ArrowUp", "ArrowDown"];

    if (this.type1 !== "HUMAN" && keysPlayerOne.includes(key)) {
      return false;
    }
    if (this.type2 !== "HUMAN" && keysPlayerTwo.includes(key)) {
      return false;
    }
    return true;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key as GameKey;
    if (key in this.keys && this.isKeyAllowedForPlayer(key)) {
      this.keys[key] = true;
    }
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    const key = event.key as GameKey;
    if (key in this.keys && this.isKeyAllowedForPlayer(key)) {
      this.keys[key] = false;
    }
  };

  unmount(): void {
    viewLogger.debug("Cleaning up GameView");
    this.toggleLangSwitcher();
    setIsAborted(true);
    this.controller.abort();
  }

  async handleGame(): Promise<void> {
    try {
      await startGame(
        this.nickname1,
        this.nickname2,
        this.type1,
        this.type2,
        this.userRole,
        this.tournament,
        this.keys
      );
      if (getIsAborted()) return;

      let view;
      if (!this.tournament) {
        view = new NewGameView();
      } else {
        if (this.tournament.getNextMatchToPlay()) {
          view = new MatchAnnouncement(this.tournament);
        } else {
          view = new ResultsView(this.tournament);
        }
      }
      router.switchView(view);
    } catch (error) {
      toaster.error(i18next.t("toast.somethingWentWrong"));
      viewLogger.error("Error in handleGame():", error);
    }
  }

  getName(): string {
    return i18next.t("gameView.title");
  }

  toggleLangSwitcher() {
    viewLogger.debug("Toggled Lang switcher");
    const button: HTMLButtonElement = getById("lang-switcher-button");
    button.disabled = !button.disabled;
    button.classList.toggle("hidden");
  }
}
