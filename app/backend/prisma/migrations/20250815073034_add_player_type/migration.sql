-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "playedAs" TEXT NOT NULL DEFAULT 'PLAYERONE',
    "player1Nickname" TEXT NOT NULL,
    "player2Nickname" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "player1Type" TEXT NOT NULL DEFAULT 'HUMAN',
    "player2Type" TEXT NOT NULL DEFAULT 'HUMAN',
    "tournamentId" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_matches" ("date", "id", "playedAs", "player1Nickname", "player1Score", "player2Nickname", "player2Score", "tournamentId", "userId") SELECT "date", "id", "playedAs", "player1Nickname", "player1Score", "player2Nickname", "player2Score", "tournamentId", "userId" FROM "matches";
DROP TABLE "matches";
ALTER TABLE "new_matches" RENAME TO "matches";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
