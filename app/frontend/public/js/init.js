import { GameState } from "./config.js";
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
GameState.initialize(canvas.width, canvas.height);
