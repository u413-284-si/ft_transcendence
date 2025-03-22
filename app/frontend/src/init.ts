import { GameState } from "./config.js";

export const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;
GameState.initialize(canvas.width, canvas.height);
