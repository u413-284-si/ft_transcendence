import type { Match as MatchDB, PlayedAs, PlayerType } from "@prisma/client";
import { Simplify } from "./Simplify";

export { PlayedAs, PlayerType };

export type MatchCreate = Omit<
  MatchDB,
  "id" | "userId" | "date" | "bracketMatchNumber" | "tournamentId"
>;

export type MatchRead = Simplify<
  Omit<MatchDB, "id" | "userId" | "tournamentId" | "bracketMatchNumber"> & {
    tournamentName: string | null;
  }
>;
