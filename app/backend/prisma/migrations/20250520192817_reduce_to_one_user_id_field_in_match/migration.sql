/*
  Warnings:

  - You are about to drop the column `player1Id` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `matchesLost` on the `user_stats` table. All the data in the column will be lost.
  - You are about to drop the column `winRate` on the `user_stats` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_matches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "playedAs" TEXT,
    "player1Nickname" TEXT NOT NULL,
    "player2Nickname" TEXT NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "tournamentId" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_matches" ("date", "id", "player1Nickname", "player1Score", "player2Nickname", "player2Score", "tournamentId") SELECT "date", "id", "player1Nickname", "player1Score", "player2Nickname", "player2Score", "tournamentId" FROM "matches";
DROP TABLE "matches";
ALTER TABLE "new_matches" RENAME TO "matches";
CREATE TABLE "new_user_stats" (
    "userId" INTEGER NOT NULL PRIMARY KEY,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "matchesWon" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_stats" ("matchesPlayed", "matchesWon", "userId") SELECT "matchesPlayed", "matchesWon", "userId" FROM "user_stats";
DROP TABLE "user_stats";
ALTER TABLE "new_user_stats" RENAME TO "user_stats";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
