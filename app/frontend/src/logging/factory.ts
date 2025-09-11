import type { LogArgs, LogLevel } from "../types/Log";
import { logLevelPriority } from "../types/Log.js";
import { globalLogLevel, logConfig } from "./config.js";

export function createLogger(moduleName: keyof typeof logConfig) {
  function getTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    return `${hh}:${mm}:${ss}.${ms}`;
  }

  const config = logConfig[moduleName];

  function log(msgLevel: LogLevel, ...args: LogArgs) {
    const effectiveLevel = globalLogLevel ?? config.level ?? "debug";
    if (effectiveLevel === "silent") return;

    if (logLevelPriority[msgLevel] < logLevelPriority[effectiveLevel]) return;

    const prefix = moduleName ? `[${moduleName}]` : "";

    const method: "log" | "info" | "warn" | "error" =
      msgLevel === "error"
        ? "error"
        : msgLevel === "warn"
          ? "warn"
          : msgLevel === "info"
            ? "info"
            : "log";

    console[method](`${getTime()} ${prefix}`, ...args);
  }

  return {
    debug: (...args: LogArgs) => log("debug", ...args),
    info: (...args: LogArgs) => log("info", ...args),
    warn: (...args: LogArgs) => log("warn", ...args),
    error: (...args: LogArgs) => log("error", ...args)
  };
}
