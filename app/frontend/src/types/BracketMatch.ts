import type { BracketMatch as BracketMatchDB } from "@prisma/client";

export type BracketMatchRead = Omit<BracketMatchDB, "tournamentId">;
