-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bracket_matches" (
    "tournamentId" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "player1Nickname" TEXT,
    "player2Nickname" TEXT,
    "player1Type" TEXT,
    "player2Type" TEXT,
    "winner" TEXT,
    "nextMatchNumber" INTEGER,
    "winnerSlot" INTEGER,

    PRIMARY KEY ("tournamentId", "matchNumber"),
    CONSTRAINT "bracket_matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bracket_matches_tournamentId_matchNumber_fkey" FOREIGN KEY ("tournamentId", "matchNumber") REFERENCES "matches" ("tournamentId", "bracketMatchNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bracket_matches" ("matchNumber", "nextMatchNumber", "player1Nickname", "player1Type", "player2Nickname", "player2Type", "round", "tournamentId", "winner", "winnerSlot") SELECT "matchNumber", "nextMatchNumber", "player1Nickname", "player1Type", "player2Nickname", "player2Type", "round", "tournamentId", "winner", "winnerSlot" FROM "bracket_matches";
DROP TABLE "bracket_matches";
ALTER TABLE "new_bracket_matches" RENAME TO "bracket_matches";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
