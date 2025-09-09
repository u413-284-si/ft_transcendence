export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};

export type LogModule =
  | "App"
  | "Router"
  | "SSE"
  | "Game"
  | "AuthManager"
  | "API"
  | "View";

export type LoggerOptions = {
  moduleName: LogModule;
};

export type LogArgs = Parameters<typeof console.log>;
