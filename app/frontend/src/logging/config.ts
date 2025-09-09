import type { LogLevel, LogModule } from "../types/Log";
import { createLogger } from "./factory.js";

export let globalLogLevel: LogLevel | null = null;

export function setGlobalLogLevel(level: LogLevel) {
  globalLogLevel = level;
}

export const logConfig: Record<LogModule, { level?: LogLevel }> = {
  App: { level: "debug" },
  Router: { level: "debug" },
  SSE: { level: "debug" },
  Game: { level: "debug" },
  AuthManager: { level: "debug" },
  API: { level: "debug" },
  View: { level: "debug" }
};

export const appLogger = createLogger("App");
export const routerLogger = createLogger("Router");
export const sseLogger = createLogger("SSE");
export const gameLogger = createLogger("Game");
export const authLogger = createLogger("AuthManager");
export const apiLogger = createLogger("API");
export const viewLogger = createLogger("View");
