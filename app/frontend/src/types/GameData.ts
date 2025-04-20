import { Tournament } from "../Tournament.js";
import { GameType } from "../views/GameView.js";

export type GameData = {
  nickname1: string;
  nickname2: string;
  type: GameType;
  tournament: Tournament | null;
};
