import type { BracketMatch as BracketMatchDB } from "@prisma/client";
import { Simplify } from "./Simplify";

export type BracketMatchRead = Omit<BracketMatchDB, "tournamentId">;

export type BracketMatchUpdate = Simplify<
  Pick<BracketMatchDB, "tournamentId" | "matchNumber"> & {
    player1Score: number;
    player2Score: number;
  }
>;
