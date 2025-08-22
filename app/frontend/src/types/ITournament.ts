import type { Tournament as TournamentDB } from "@prisma/client";
import type { PlayerType } from "./IMatch";
import type { Simplify } from "./Simplify";
import type { BracketMatchRead } from "./BracketMatch";

export type TournamentSize = 4 | 8 | 16;

export type TournamentCreate = Simplify<
  Omit<
    TournamentDB,
    "id" | "isPrivate" | "isFinished" | "userId" | "roundReached" | "updatedAt"
  > & {
    nicknames: string[];
    playerTypes: PlayerType[];
  }
>;

export type TournamentRead = Simplify<
  Omit<TournamentDB, "isPrivate" | "userId"> & {
    bracket: BracketMatchRead[];
  }
>;
